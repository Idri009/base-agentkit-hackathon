// app/api/price-stream/route.ts
import { addPriceClient, removePriceClient } from "@/app/utils/priceBroadcast";

let controllerRef: ReadableStreamDefaultController | null = null;

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      addPriceClient(controller);
    },
    cancel() {
      if (controllerRef) removePriceClient(controllerRef);
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

