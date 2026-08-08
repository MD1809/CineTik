import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ initialSeconds = 300, onTimeout }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeout) onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeout]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = secondsLeft <= 60;

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-sm font-bold transition-all ${
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
