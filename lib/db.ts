// Adapted from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
//
// The connection is created lazily rather than at module scope so that importing
// this file has no side effects. Next evaluates every route module during the
// "Collecting page data" phase of `next build`, so a module-scope connect() would
// make the build require a reachable database — and bake secrets into build args.
import { MongoClient } from "mongodb"

// No `serverApi` here: that is an Atlas Stable-API setting. Against a self-hosted
// mongod, `strict: true` rejects any command outside the Stable API (which is how
// index creation was failing silently).
const options = {}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

/**
 * Returns a shared, connected MongoClient.
 *
 * The promise is cached on globalThis in production as well as development:
 * Next isolates route modules, so a module-scoped cache can end up creating
 * several connection pools inside a single process.
 */
export function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect().catch((error) => {
      // Clear the cache so the next request retries instead of resolving a
      // permanently-rejected promise (an unhandled rejection kills Node 22).
      global._mongoClientPromise = undefined
      throw error
    })
  }

  return global._mongoClientPromise
}

export default getMongoClient
