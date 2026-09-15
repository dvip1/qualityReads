# syntax=docker/dockerfile:1.7
#
# Debian slim rather than Alpine on purpose: musl's allocator fragments under
# sharp (sharp documents this), and this app is exactly the shape that suffers --
# one long-lived process doing on-demand /_next/image optimization. The mongodb
# driver's optional native addons are also only reliably prebuilt for glibc.
ARG NODE_VERSION=22-bookworm-slim

# ---------------------------------------------------------------- deps --------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# devDependencies are needed: `next build` runs tsc and eslint. They never reach
# the runner, which only copies .next/standalone.
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --include=dev

# ------------------------------------------------------------- builder --------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    SKIP_STARTUP_TASKS=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No build args and no secrets: lib/db.ts and lib/redis.ts connect lazily, so the
# build needs neither a database nor an .env file. The resulting image is
# environment-agnostic.
RUN --mount=type=cache,target=/app/.next/cache,sharing=locked \
    npm run build

# -------------------------------------------------------------- runner --------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    TZ=UTC

# Output tracing writes a self-contained server into .next/standalone but
# deliberately leaves out .next/static and public/ -- both must be copied by hand.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static      ./.next/static
COPY --from=builder --chown=node:node /app/public            ./public

# sharp is a conditional require inside next/dist/server/image-optimizer, so
# tracing does not reliably pick it up. Same base image as the builder, so the
# prebuilt binary matches.
COPY --from=builder --chown=node:node /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder --chown=node:node /app/node_modules/@img  ./node_modules/@img

# The image optimizer writes here; without this every /_next/image request logs
# EACCES.
RUN mkdir -p /app/.next/cache/images && chown -R node:node /app/.next

USER node
EXPOSE 3000

# HOSTNAME=0.0.0.0 above is load-bearing: Docker injects HOSTNAME=<container-id>
# into the environment, and standalone server.js reads process.env.HOSTNAME, so
# without the override Next binds to the container id and is unreachable.
CMD ["node", "server.js"]
