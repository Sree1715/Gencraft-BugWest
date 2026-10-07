import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RoundTimerProps {
  initialSeconds: number;
  onTimeExpired: () => void;
  onTick?: (secondsLeft: number) => void;
  isPaused?: boolean;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({
  initialSeconds,
  onTimeExpired,
  onTick,
  isPaused = false
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused, onTimeExpired, onTick]);

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
