/**
 * Real-time presence registry (single Node process, in-memory).
 * Every connected browser holds an open SSE stream; the stream lifetime IS the
 * presence signal, so refresh / close / network drop are handled automatically.
 */
type Client = {
  id: string;
  send: (count: number) => void;
};

type Registry = {
  clients: Map<string, Client>;
};

const globalRef = globalThis as unknown as { __presence?: Registry };

const registry: Registry =
  globalRef.__presence ?? (globalRef.__presence = { clients: new Map() });

export function getOnlineCount(): number {
  return registry.clients.size;
}

function broadcast() {
  const count = registry.clients.size;
  for (const client of registry.clients.values()) {
    try {
      client.send(count);
    } catch {
      registry.clients.delete(client.id);
    }
  }
}

export function addClient(client: Client): () => void {
  registry.clients.set(client.id, client);
  broadcast();
  let removed = false;
  return () => {
    if (removed) return;
    removed = true;
    registry.clients.delete(client.id);
    broadcast();
  };
}
