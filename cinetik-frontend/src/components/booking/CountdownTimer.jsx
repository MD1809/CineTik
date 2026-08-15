import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ initialSeconds = 300, onTimeout, resetKey, isActive = false }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const hasTimedOutRef = useRef(false);

  // Reset secondsLeft when initialSeconds, resetKey, or isActive changes
  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(initialSeconds);
      hasTimedOutRef.current = false;
    }
  }, [initialSeconds, resetKey, isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (secondsLeft <= 0) {
      if (!hasTimedOutRef.current) {
        hasTimedOutRef.current = true;
        if (onTimeout) onTimeout();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeout, isActive]);

  const minutes = Math.floor(Math.max(0, secondsLeft) / 60);
  const seconds = Math.max(0, secondsLeft) % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = isActive && secondsLeft <= 60;

  if (!isActive) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-sm font-bold transition-all animate-in fade-in ${
        isLowTime
          ? 'bg-rose-950/80 border-rose-600 text-rose-400 animate-pulse'
          : 'bg-slate-900 border-slate-800 text-amber-400'
      }`}
    >
      <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-amber-400'}`} />
      <span>Thời gian giữ ghế: {formattedTime}</span>
    </div>
  );
};

export default CountdownTimer;
