"use client";

import { useEffect, useState } from "react";

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Generate or retrieve persistent tab session ID
    let sessionId = sessionStorage.getItem("dhuaan_presence_session_id");
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      sessionStorage.setItem("dhuaan_presence_session_id", sessionId);
    }

    let isSubscribed = true;

    async function sendHeartbeat() {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (isSubscribed && data.success && typeof data.count === "number") {
          setOnlineUsers(data.count);
          setIsConnected(true);
        }
      } catch {
        if (isSubscribed) setIsConnected(false);
      }
    }

    // Initial heartbeat
    void sendHeartbeat();

    // Heartbeat every 8 seconds
    const interval = setInterval(() => {
      void sendHeartbeat();
    }, 8000);

    // Leave beacon on tab close
    const handleUnload = () => {
      try {
        navigator.sendBeacon(
          "/api/presence",
          JSON.stringify({ sessionId, leave: true })
        );
      } catch {
        // Ignore
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return { onlineUsers, isConnected };
}
