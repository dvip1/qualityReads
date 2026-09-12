import Redis, { type RedisOptions } from "ioredis"

// NOTE: REDIS_URI is a bare hostname, not a redis:// URL — it is passed straight
// through as ioredis's `host`.
function redisOptions(): RedisOptions {
    const options: RedisOptions = {
        host: process.env.REDIS_URI || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        // Nothing connects until the first command is issued. Without this,
        // importing this module during `next build` opens a socket and starts a
        // reconnect loop against a database that is not there.
        lazyConnect: true,
        maxRetriesPerRequest: 3,
    }
    if (process.env.REDIS_PASSWORD) {
        options.password = process.env.REDIS_PASSWORD
    }
    return options
}

declare global {
    // eslint-disable-next-line no-var
    var _redisClient: Redis | undefined
}

/**
 * Shared Redis client for ordinary commands.
 *
 * Cached on globalThis so Next's per-route module isolation (and dev HMR) cannot
 * multiply connections.
 */
export function getRedisClient(): Redis {
    if (!global._redisClient) {
        const client = new Redis(redisOptions())
        client.on("error", (error) => {
            console.error("[redis] connection error:", error.message)
        })
        global._redisClient = client
    }
    return global._redisClient
}

/**
 * A dedicated connection for pub/sub.
 *
 * An ioredis connection in subscriber mode cannot issue normal commands, so SSE
 * streams must not borrow the shared client. Callers own the returned client and
 * are responsible for calling quit() when the stream ends.
 */
export function createRedisSubscriber(): Redis {
    return new Redis(redisOptions())
}

export default getRedisClient
