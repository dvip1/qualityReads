/**
 * Runs once when the Next server process starts.
 *
 * Index creation used to live at module scope in app/layout.tsx, which meant it
 * fired during `next build` (once per page-data worker) and forced the build to
 * have a reachable database. Here it runs on container start instead.
 */
export async function register() {
  // Only the Node.js server runtime, not the edge compile pass.
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  // Next also calls register() during the production build.
  if (process.env.NEXT_PHASE === "phase-production-build") return
  // Explicit escape hatch, set by the Dockerfile's build stage.
  if (process.env.SKIP_STARTUP_TASKS === "1") return

  const { createOptimizedIndexes } = await import("@/lib/createIndexes")
  await createOptimizedIndexes()
}
