// utils/strategyBroadcast.ts
const clients: any[] = [];

export function addClient(controller: any) {
  clients.push(controller);
}

export function broadcastStrategy(strategy: any) {
  console.log("broadcastStrategy.ts",strategy)
  clients.forEach((c) => c.enqueue(`data: ${JSON.stringify(strategy)}\n\n`));
}

export function removeClient(controller: any) {
  const index = clients.indexOf(controller);
  if (index > -1) clients.splice(index, 1);
}

