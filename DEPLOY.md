# Deploying QualityReads

The whole stack (app + MongoDB + Redis) runs from one compose file. There are no
external services: no MongoDB Atlas, no Ably, no Google Fonts fetch at build time.

## Prerequisites

- Docker Engine with the Compose plugin (`docker compose version`)
- A reverse proxy on the host for TLS — see [Reverse proxy](#reverse-proxy)
- **An AVX-capable CPU.** MongoDB 5.0+ requires it and will crash-loop with
  `Illegal instruction` without it:

      grep -o avx /proc/cpuinfo | head -1      # must print "avx"

## First run

```bash
git clone <repo> qualityreads && cd qualityreads

cp .env.example .env
openssl rand -base64 32          # paste into AUTH_SECRET
$EDITOR .env                     # set passwords + Google OAuth credentials

# Optional: restore an existing database on first boot
cp /path/to/QualityReads.archive.gz seed/

docker compose up -d --build
```

That is the whole deployment. The app comes up on `127.0.0.1:3000`, MongoDB
indexes are created automatically on start, and if `seed/QualityReads.archive.gz`
is present it is restored before the app first connects.

Check it:

```bash
curl -fsS localhost:3000/api/health     # {"ok":true}
docker compose ps                       # all three healthy
docker compose logs -f app
```

### About the seed restore

`docker/mongo-init/01-restore.sh` runs only when MongoDB initialises an **empty**
data volume, so it seeds once and never touches your data again. Leaving the
archive in `seed/` afterwards is harmless. To deliberately start over:

```bash
docker compose down
docker volume rm qualityreads_mongo_data qualityreads_mongo_config
docker compose up -d
```

`MONGO_DB` in `.env` must match the database name inside the archive
(`QualityReads`), because the app calls `client.db()` with no argument and takes
the name from the connection URI.

## Google OAuth

In Google Cloud Console → APIs & Services → Credentials, open your OAuth 2.0
client and add:

| Field | Value |
|---|---|
| Authorized JavaScript origin | `https://reads.client.dvippatel.in` |
| Authorized redirect URI | `https://reads.client.dvippatel.in/api/auth/callback/google` |

Exact match, no trailing slash. Keep `http://localhost:3000/api/auth/callback/google`
alongside it if you also run the app locally.

## Reverse proxy

Two things here are not optional, and both fail in ways that look like app bugs.

**1. Server-Sent Events.** Live notifications stream from
`/api/notifications/stream`. nginx's default 60-second read timeout kills the
stream, and its response buffering swallows events. The route sends
`X-Accel-Buffering: no`, which nginx honours per response, but set the location
block too.

**2. Forwarded headers.** `auth.ts` uses `trustHost: true`, so Auth.js derives its
base URL from `X-Forwarded-Proto` and `Host`. Without `X-Forwarded-Proto: https`
the `redirect_uri` sent to Google becomes `http://…` (→ `redirect_uri_mismatch`)
and the session cookie loses its `Secure` flag. Setting `AUTH_URL` in `.env` pins
this regardless, but send the headers anyway — `app/layout.tsx` also uses `Host`
to build OpenGraph URLs.

### nginx

```nginx
upstream qualityreads {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 443 ssl;
    http2 on;
    server_name reads.client.dvippatel.in;

    # ssl_certificate     /etc/letsencrypt/live/reads.client.dvippatel.in/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/reads.client.dvippatel.in/privkey.pem;

    client_max_body_size 2m;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host  $host;
    proxy_set_header X-Forwarded-Port  $server_port;

    # Notification stream. Must not be buffered, compressed, or timed out.
    location /api/notifications/stream {
        proxy_pass http://qualityreads;
        proxy_http_version 1.1;
        proxy_set_header Connection "";     # empty, not "upgrade" -- SSE is not a websocket
        proxy_buffering off;
        proxy_cache off;
        proxy_request_buffering off;
        chunked_transfer_encoding off;
        gzip off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    location /_next/static {
        proxy_pass http://qualityreads;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://qualityreads;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering on;
        proxy_read_timeout 60s;
    }
}

server {
    listen 80;
    server_name reads.client.dvippatel.in;
    return 301 https://$host$request_uri;
}
```

### Caddy

Caddy sets the `X-Forwarded-*` headers itself, so only the SSE handling needs care.

```caddyfile
reads.client.dvippatel.in {
	encode zstd gzip {
		match {
			header Content-Type text/html* text/css* application/javascript* application/json*
		}
	}

	@sse path /api/notifications/stream*
	reverse_proxy @sse 127.0.0.1:3000 {
		flush_interval -1
		transport http {
			read_timeout 0
			write_timeout 0
		}
	}

	reverse_proxy 127.0.0.1:3000
}
```

The `encode … match` block matters: a bare `encode zstd gzip` compresses and
buffers `text/event-stream` and the notification stream stops working.

## Updating

```bash
git pull
docker compose up -d --build
```

Open notification streams drop and the browser reconnects on its own after ~5s
(the server sends a `retry: 5000` hint). `stop_grace_period: 30s` gives in-flight
requests time to finish.

## Backups

Both MongoDB **and** Redis hold durable data — Redis stores notifications and
trending rankings, not just cache.

```bash
set -a; source .env; set +a

# MongoDB: logical dump, restorable across versions
docker compose exec -T mongo mongodump --archive --gzip \
  -u "$MONGO_USER" -p "$MONGO_PASSWORD" --authenticationDatabase admin \
  --db "$MONGO_DB" > "mongo-$(date +%F).archive.gz"

# Redis: flush the append-only file, then snapshot the whole volume.
# Redis 7 uses a multi-part AOF in /data/appendonlydir/, so archive all of /data.
docker compose exec -T redis redis-cli --no-auth-warning -a "$REDIS_PASSWORD" BGREWRITEAOF
docker run --rm -v qualityreads_redis_data:/data -v "$PWD":/backup alpine \
  tar czf "/backup/redis-$(date +%F).tgz" -C /data .
```

Restore MongoDB with `mongorestore --archive --gzip --drop < file`. Do not copy
the MongoDB volume directory while the container is running — use `mongodump`.

## Environment variables

| Variable | Notes |
|---|---|
| `MONGO_USER` / `MONGO_PASSWORD` | Root credentials created on first boot. Percent-encode the password if it contains `@ : / ? # [ ] %`. |
| `MONGO_DB` | Must match the database name in the seed archive (`QualityReads`). |
| `REDIS_PASSWORD` | Required; Redis is started with `--requirepass`. |
| `AUTH_SECRET` | `openssl rand -base64 32`. Auth.js refuses to start in production without it. |
| `AUTH_URL` | `https://reads.client.dvippatel.in`. Pins the OAuth callback URL. |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | From Google Cloud Console. |
| `APP_BIND` / `APP_PORT` | Host binding, default `127.0.0.1:3000`. Use `0.0.0.0` only if your proxy runs on another machine. |

The app container also receives `MONGODB_URI` and `REDIS_URI`/`REDIS_PORT`/
`REDIS_PASSWORD`, assembled by `compose.yaml` from the above. Note `REDIS_URI` is
a bare **hostname**, not a `redis://` URL.

There are no build arguments. The image contains no configuration, so the same
build runs in any environment.

## Troubleshooting

**Login redirects to `http://` or fails with `redirect_uri_mismatch`**
The proxy is not sending `X-Forwarded-Proto: https`. Confirm `AUTH_URL` is set too.

**Notification toasts never appear**
Check the stream directly from the host, bypassing the proxy:

```bash
curl -N -H 'Cookie: authjs.session-token=<token>' localhost:3000/api/notifications/stream
```

You should see `event: ready` immediately and `: ping` every 20 seconds. If that
works but the browser does not, the proxy is buffering — revisit the SSE location
block.

**`Illegal instruction` from the mongo container**
The CPU lacks AVX. MongoDB 5.0+ cannot run there.

**Seed archive was ignored**
It only restores into an empty volume. `docker compose logs mongo | grep '\[init\]'`
shows what happened. On SELinux hosts (Fedora, RHEL) the `:ro,z` suffix on the
bind mounts is what makes the directory readable inside the container — it is
already set in `compose.yaml`.
