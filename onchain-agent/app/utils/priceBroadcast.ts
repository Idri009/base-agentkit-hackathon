// app/utils/priceBroadcast.ts
const clients: ReadableStreamDefaultController[] = [];

export function addPriceClient(controller: ReadableStreamDefaultController) {
  console.log("DEBUG addPriceClient")
  clients.push(controller);
}

export function broadcastPrice(priceData: any) {
  clients.forEach((c) => c.enqueue(`data: ${JSON.stringify(priceData)}\n\n`));
}

export function removePriceClient(controller: ReadableStreamDefaultController) {
  const index = clients.indexOf(controller);
  if (index > -1) clients.splice(index, 1);
}

