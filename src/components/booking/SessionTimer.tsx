import { useEffect, useRef, useState } from "react";

type SessionTimerProps = {
  expiresAt?: string;
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
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export default function SessionTimer({
  expiresAt,
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
    <div className="rounded-2xl bg-brand-red px-5 py-3 text-center text-white shadow-movie-card">
      <p className="text-[12px] leading-4 font-semibold tracking-[0.08em] uppercase">
        Session expires in
      </p>
      <p className="mt-1 text-[28px] leading-8 font-bold tabular-nums">
        {formatRemainingTime(remainingSeconds)}
      </p>
    </div>
  );
}
