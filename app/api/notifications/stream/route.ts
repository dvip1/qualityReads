import { auth } from "@/auth"
import { getMongoClient } from "@/lib/db"
import { createRedisSubscriber } from "@/lib/redis"
import { notificationChannel } from "@/lib/notifications"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Idle proxies drop silent connections at around 60s, so send a comment well
// inside that window.
const HEARTBEAT_MS = 20_000

export async function GET(req: Request) {
    const session = await auth()
    const email = session?.user?.email
    if (!email) {
        return new Response("Unauthorized", { status: 401 })
    }

    const client = await getMongoClient()
    const user = await client
        .db()
        .collection("users")
        .findOne({ email }, { projection: { _id: 1 } })

    if (!user) {
        return new Response("Unauthorized", { status: 401 })
    }

    const channel = notificationChannel(user._id.toString())
    const encoder = new TextEncoder()

    const subscriber = createRedisSubscriber()
    let heartbeat: ReturnType<typeof setInterval> | undefined
    let closed = false

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const send = (chunk: string) => {
                if (closed) return
                try {
                    controller.enqueue(encoder.encode(chunk))
                } catch {
                    // The client went away between the abort signal and now.
                }
            }

            const cleanup = () => {
                if (closed) return
                closed = true
                if (heartbeat) clearInterval(heartbeat)
                // quit() also drops the subscription; without it every
                // disconnect leaks a Redis connection.
                subscriber.quit().catch(() => subscriber.disconnect())
                try {
                    controller.close()
                } catch {
                    // Already closed.
                }
            }

            req.signal.addEventListener("abort", cleanup)

            subscriber.on("error", (error) => {
                console.error("[sse] subscriber error:", error.message)
            })

            subscriber.on("message", (_channel, message) => {
                send(`event: notification\ndata: ${message}\n\n`)
            })

            try {
                await subscriber.subscribe(channel)
            } catch (error) {
                console.error("[sse] subscribe failed:", error)
                cleanup()
                return
            }

            // Tell the browser how long to wait before reconnecting, then open
            // the stream so the client's onopen fires and it resyncs its count.
            send(`retry: 5000\n\n`)
            send(`event: ready\ndata: {"ok":true}\n\n`)

            heartbeat = setInterval(() => send(`: ping\n\n`), HEARTBEAT_MS)

            if (req.signal.aborted) cleanup()
        },
        cancel() {
            if (heartbeat) clearInterval(heartbeat)
            closed = true
            subscriber.quit().catch(() => subscriber.disconnect())
        },
    })

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-store, no-transform",
            Connection: "keep-alive",
            // Belt and braces: nginx honours this per-response, so the stream
            // survives even without proxy_buffering off in the site config.
            "X-Accel-Buffering": "no",
        },
    })
}
