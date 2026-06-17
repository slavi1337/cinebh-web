import { useEffect, useRef, useState } from "react";

type SessionTimerProps = {
  expiresAt?: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  timeClassName?: string;
  showLabel?: boolean;
  onExpired?: () => void;
};

function getRemainingSeconds(expiresAt: string | undefined, nowMs: number) {
  if (!expiresAt) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - nowMs) / 1000),
  );
}

function formatRemainingTime(seconds: number) {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function SessionTimer({
  expiresAt,
  label = "Session expires in",
  className = "rounded-2xl bg-brand-red px-5 py-3 text-center text-white shadow-movie-card",
  labelClassName = "text-[12px] leading-4 font-semibold tracking-[0.08em] uppercase",
  timeClassName = "mt-1 text-[28px] leading-8 font-bold tabular-nums",
  showLabel = true,
  onExpired,
}: SessionTimerProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const hasExpiredRef = useRef(false);
  const remainingSeconds = getRemainingSeconds(expiresAt, nowMs);

  useEffect(() => {
    hasExpiredRef.current = false;

    if (!expiresAt) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  useEffect(() => {
    if (!expiresAt || remainingSeconds > 0 || hasExpiredRef.current) {
      return;
    }

    hasExpiredRef.current = true;
    onExpired?.();
  }, [expiresAt, onExpired, remainingSeconds]);

  return (
    <div className={className}>
      {showLabel ? <p className={labelClassName}>{label}</p> : null}
      <p className={timeClassName}>{formatRemainingTime(remainingSeconds)}</p>
    </div>
  );
}
