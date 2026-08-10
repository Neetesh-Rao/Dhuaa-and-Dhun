"use client";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";

export default function OnlineUsers() {
  const { onlineUsers, isConnected } = useOnlineUsers();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${onlineUsers} listeners online`}
      className="flex items-center gap-1.5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] select-none"
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {isConnected && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            isConnected
              ? "bg-emerald-400 shadow-[0_0_10px_#34d399]"
              : "bg-amber-400"
          }`}
        />
      </span>
      <span className="text-[12.5px] font-normal text-white/95 tabular-nums sm:text-[13.5px]">
        <strong className="font-semibold">{isConnected ? onlineUsers : "--"}</strong> online
      </span>
    </div>
  );
}
