'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRevealProps {
  score: number;
  tier: string;
  tierLabel: string;
  tierTagline: string;
}

const TIER_STYLES: Record<string, { color: string; bg: string; ring: string }> = {
  'ai-curious': { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', ring: 'ring-amber-500/30' },
  'ai-exploring': { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', ring: 'ring-blue-500/30' },
  'ai-scaling': { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', ring: 'ring-emerald-500/30' },
  'ai-leading': { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', ring: 'ring-purple-500/30' },
};

export default function ScoreReveal({ score, tier, tierLabel, tierTagline }: ScoreRevealProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const style = TIER_STYLES[tier] || TIER_STYLES['ai-curious'];

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      {/* Score circle */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg className="w-40 h-40" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle cx="80" cy="80" r="70" fill="none" stroke="#1a2d4d" strokeWidth="4" />
          {/* Score arc */}
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={2 * Math.PI * 70}
            animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - score / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            className={style.color}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tabular-nums ${style.color}`}>
            {displayScore}
          </span>
          <span className="text-slate-500 text-xs mt-1">out of 100</span>
        </div>
      </div>

      {/* Tier badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-semibold mb-2 ${style.bg} ${style.color}`}>
          {tierLabel}
        </div>
        <p className="text-slate-400 text-sm">{tierTagline}</p>
      </motion.div>
    </motion.div>
  );
}
