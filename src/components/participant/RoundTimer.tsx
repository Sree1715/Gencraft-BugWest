import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RoundTimerProps {
  initialSeconds?: number;
  endTime?: string | null;
  onTimeExpired: () => void;
  onTick?: (secondsLeft: number) => void;
  isPaused?: boolean;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({
  initialSeconds = 1200,
  endTime,
  onTimeExpired,
  onTick,
  isPaused = false
}) => {
  const hasFiredRef = useRef(false);
  const onTimeExpiredRef = useRef(onTimeExpired);
  onTimeExpiredRef.current = onTimeExpired;

  const calculateSecondsLeft = (): number => {
    if (endTime) {
      const endMs = new Date(endTime).getTime();
      const nowMs = Date.now();
      const diffSec = Math.floor((endMs - nowMs) / 1000);
      return Math.max(0, diffSec);
    }
    return initialSeconds;
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateSecondsLeft);

  // Recalculate and reset fired flag when endTime or initialSeconds changes
  useEffect(() => {
    const remaining = calculateSecondsLeft();
    setSecondsLeft(remaining);
    if (remaining > 0) {
      hasFiredRef.current = false;
    }
  }, [endTime, initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const initial = calculateSecondsLeft();
    if (initial <= 0) {
      // If already expired at mount, don't repeatedly trigger
      if (!hasFiredRef.current) {
        hasFiredRef.current = true;
      }
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateSecondsLeft();
      setSecondsLeft(remaining);
      if (onTick) onTick(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (!hasFiredRef.current) {
          hasFiredRef.current = true;
          onTimeExpiredRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, isPaused, onTick]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 180; // under 3 mins
  const isCritical = secondsLeft < 60; // under 1 min

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono transition-colors text-xs font-bold ${
        isCritical
          ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
          : isUrgent
          ? 'bg-amber-50 text-amber-800 border-amber-300'
          : 'bg-slate-100 text-slate-800 border-slate-200'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-slate-500" />
      )}
      <span className="tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      {isPaused && (
        <span className="text-[10px] text-amber-700 font-sans uppercase font-normal">
          (Paused)
        </span>
      )}
    </div>
  );
};
