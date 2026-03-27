'use client';

import { motion } from 'framer-motion';
import { DimensionScore } from '@/types/assessment';

interface DimensionCardProps {
  score: DimensionScore;
  index: number;
}

export default function DimensionCard({ score, index }: DimensionCardProps) {
  const isAboveBenchmark = score.gap >= 0;
  const barWidth = (score.score / 4) * 100;
  const benchmarkPos = (score.benchmark / 4) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.08, duration: 0.3 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white">{score.dimensionName}</h4>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold tabular-nums ${
            score.score >= 3 ? 'text-emerald-400' : score.score >= 2 ? 'text-blue-400' : 'text-amber-400'
          }`}>
            {score.score}
          </span>
          <span className="text-slate-600 text-xs">/4</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="relative h-2 bg-[#1a2d4d] rounded-full mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ delay: 1 + index * 0.08, duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            score.score >= 3 ? 'bg-emerald-500' : score.score >= 2 ? 'bg-blue-500' : 'bg-amber-500'
          }`}
        />
        {/* Benchmark marker */}
        <div
          className="absolute top-[-3px] w-0.5 h-[14px] bg-slate-400"
          style={{ left: `${benchmarkPos}%` }}
          title={`Industry avg: ${score.benchmark}`}
        />
      </div>

      {/* Benchmark comparison */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Industry avg: {score.benchmark.toFixed(1)}
        </span>
        <span className={isAboveBenchmark ? 'text-emerald-400' : 'text-amber-400'}>
          {isAboveBenchmark ? '\u25B2' : '\u25BC'} {Math.abs(score.gap).toFixed(1)} {isAboveBenchmark ? 'above' : 'below'}
        </span>
      </div>
    </motion.div>
  );
}
