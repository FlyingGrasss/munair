"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };
const empty: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function getRemaining(target: number | null): TimeLeft {
  if (!target) return empty;
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
  };
}

const units: Array<keyof TimeLeft> = ["days", "hours", "minutes", "seconds"];

export default function SessionCountdown({ date }: { date: string }) {
  const target = useMemo(() => {
    const parsed = Date.parse(date);
    return Number.isNaN(parsed) ? null : parsed;
  }, [date]);
  const [time, setTime] = useState(empty);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => setTime(getRemaining(target));
    update();
    setMounted(true);
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, [target]);

  return <section className="session-countdown-band" aria-label="Countdown to MUNAIR 27">
    <div className="site-container"><div className="session-countdown">
      <div className="session-countdown__units">{units.map((unit) => <div key={unit} className="session-countdown__unit"><strong>{mounted ? String(time[unit]).padStart(2, "0") : "00"}</strong><span>{unit}</span></div>)}</div>
    </div></div>
  </section>;
}
