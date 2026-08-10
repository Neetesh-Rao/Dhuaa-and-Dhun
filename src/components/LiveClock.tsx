"use client";

import { useEffect, useState } from "react";

function format(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      suppressHydrationWarning
      aria-label="Current local time"
      className="select-none text-[13px] font-normal text-white/90 tabular-nums sm:text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
    >
      {time ?? "11:51 am"}
    </span>
  );
}
