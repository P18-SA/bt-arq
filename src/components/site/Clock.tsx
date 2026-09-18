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

  const [h, m] = (time ?? "--:--").split(":");

  // Hora, dos puntos y minutos por separado: los dos puntos laten solos, los números no se mueven
  return (
    <p className={`flex items-baseline gap-x-[0.85em] ${className}`}>
      <span className="flex font-medium tabular-nums text-graphite">
        <span>{h}</span>
        <span data-clock-blink className="px-[0.06em]">
          :
        </span>
        <span>{m}</span>
      </span>
      <span className="whitespace-nowrap">Montevideo, UY</span>
    </p>
  );
}
