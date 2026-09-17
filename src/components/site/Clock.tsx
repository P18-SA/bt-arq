"use client";

import { useEffect, useState } from "react";

/** Hora local del estudio, en vivo. Se resuelve en el cliente para no fijar la hora del build. */
export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-UY", {
      timeZone: "America/Montevideo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={`flex items-baseline gap-2 tabular-nums ${className}`}>
      <span className="opacity-60">{time ?? "--:--"}</span>
      <span>Montevideo, UY</span>
    </p>
  );
}
