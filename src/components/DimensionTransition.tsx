'use client';

import { motion } from 'framer-motion';
import { dimensions } from '@/data/dimensions';

interface DimensionTransitionProps {
  fromIndex: number;
  toIndex: number;
}

const DIMENSION_ICONS = ['📊', '🤖', '☁️', '🛡️', '👥', '📈', '💰'];

export default function DimensionTransition({ fromIndex, toIndex }: DimensionTransitionProps) {
  const nextDimension = dimensions[toIndex];
  const isFinishing = toIndex >= dimensions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1628]">
      {/* Radial glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative flex flex-col items-center">
        {/* Spinning ring */}
        <motion.div
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{ rotate: { duration: 1.5, ease: 'linear' }, opacity: { duration: 0.3 } }}
          className="w-24 h-24 mb-6 relative"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#1a2d4d" strokeWidth="3" />
            <motion.circle
              cx="50" cy="50" r="44"
              fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="80 200"
              initial={{ strokeDashoffset: 280 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center"
            >
              <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                {isFinishing ? 'Results' : 'Dimension'}
              </span>
              <div className="flex items-center gap-1.5 relative">
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -8 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-slate-500 text-lg font-bold font-mono"
                >
                  {fromIndex + 1}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3, type: 'spring' }}
                  className="text-blue-400 text-lg font-bold font-mono absolute"
                >
                  {isFinishing ? '✓' : toIndex + 1}
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dimension label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center"
        >
          <div className="text-blue-400 font-semibold text-sm mb-1">
            {isFinishing ? 'Calculating Your Results...' : nextDimension?.name}
          </div>
          <div className="text-slate-500 text-xs">
            {isFinishing ? 'Benchmarking against industry data' : 'Advancing to next dimension...'}
          </div>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex items-center gap-1.5 mt-6"
        >
          {dimensions.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.3, type: 'spring', stiffness: 300 }}
              className={`h-2 rounded-full transition-all ${
                i < toIndex
                  ? 'w-4 bg-blue-500'
                  : i === toIndex
                  ? 'w-6 bg-blue-400 animate-pulse'
                  : 'w-2.5 bg-[#1a2d4d]'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
