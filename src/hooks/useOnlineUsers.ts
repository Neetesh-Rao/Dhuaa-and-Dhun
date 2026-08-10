"use client";

import { useEffect, useRef, useState } from "react";

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let closed = false;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      if (closed) return;
      const source = new EventSource("/api/presence");
      sourceRef.current = source;

      source.onopen = () => setIsConnected(true);
      source.addEventListener("count", (event) => {
        try {
          const payload = JSON.parse((event as MessageEvent<string>).data) as {
            count: number;
          };
          setOnlineUsers(payload.count);
          setIsConnected(true);
        } catch {
          /* ignore malformed frame */
        }
      });
      source.onerror = () => {
        setIsConnected(false);
        source.close();
        sourceRef.current = null;
        if (!closed) retry = setTimeout(connect, 2500);
      };
    };

    connect();

    return () => {
      closed = true;
      if (retry) clearTimeout(retry);
      sourceRef.current?.close();
      sourceRef.current = null;
    };
  }, []);

  return { onlineUsers, isConnected };
}
