// app/api/strategy-stream/route.ts
import { addClient, removeClient } from "@/app/utils/strategyBroadcast";

let controllerRef: ReadableStreamDefaultController | null = null;

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      addClient(controller);
    },
    cancel() {
      if (controllerRef) removeClient(controllerRef);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

