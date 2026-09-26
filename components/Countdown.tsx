"use client";

import { useEffect, useMemo, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };
const empty: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function remaining(target: number | null): TimeLeft {
  if (!target) return empty;
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };
}

export default function Countdown({ date }: { date: string }) {
  const target = useMemo(() => { const parsed = Date.parse(date); return Number.isNaN(parsed) ? null : parsed; }, [date]);
  const [time, setTime] = useState(empty);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const first = window.setTimeout(() => { setMounted(true); setTime(remaining(target)); }, 0); const timer = window.setInterval(() => setTime(remaining(target)), 1_000); return () => { window.clearTimeout(first); window.clearInterval(timer); }; }, [target]);
  return <div className="grid grid-cols-4 gap-2" aria-label="Time until MUNAIR">{Object.entries(time).map(([label, value]) => <div key={label} className="min-w-0 border-l border-white/25 px-2 first:border-l-0 sm:px-5"><span className="block text-2xl font-extrabold tabular-nums sm:text-4xl">{mounted ? String(value).padStart(2, "0") : "00"}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.15em] text-white/65 sm:text-xs">{label}</span></div>)}</div>;
}
