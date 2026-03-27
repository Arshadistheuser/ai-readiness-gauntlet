'use client';

import { motion } from 'framer-motion';
import { MaturityLevel } from '@/types/assessment';
import { dimensions } from '@/data/dimensions';

interface LiveScoreBarProps {
  answers: Record<string, MaturityLevel>;
  currentQuestion: number;
}

const SCORE_COLORS = ['', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'];
const SCORE_RING_COLORS = ['', 'border-amber-500', 'border-blue-500', 'border-emerald-500', 'border-purple-500'];

export default function LiveScoreBar({ answers, currentQuestion }: LiveScoreBarProps) {
  const answeredCount = Object.keys(answers).length;
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const avgScore = answeredCount > 0 ? totalScore / answeredCount : 0;
  const normalizedAvg = answeredCount > 0 ? Math.round(((avgScore - 1) / 3) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-40 bg-[#0a1628]/90 backdrop-blur-sm border-b border-[#1a2d4d]"
    >
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Dimension indicators */}
        <div className="flex items-center gap-2">
          {dimensions.map((dim, i) => {
            const answer = answers[dim.id];
            const isActive = i === currentQuestion;
            const isAnswered = answer !== undefined;

            return (
              <div key={dim.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isAnswered
                      ? `${SCORE_COLORS[answer]} text-white shadow-sm`
                      : isActive
                      ? 'border-2 border-blue-400 text-blue-400 animate-pulse'
                      : 'border border-[#1a2d4d] text-slate-600'
                  }`}
                >
                  {isAnswered ? answer : i + 1}
                </div>
                <span className={`text-[8px] font-medium ${
                  isActive ? 'text-blue-400' : isAnswered ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {dim.shortName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Running score */}
        {answeredCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Running Score</div>
              <div className="text-lg font-bold text-blue-400 tabular-nums leading-tight">{normalizedAvg}</div>
            </div>
            <div className={`w-9 h-9 rounded-full border-2 ${
              normalizedAvg >= 75 ? SCORE_RING_COLORS[4] :
              normalizedAvg >= 50 ? SCORE_RING_COLORS[3] :
              normalizedAvg >= 25 ? SCORE_RING_COLORS[2] :
              SCORE_RING_COLORS[1]
            } flex items-center justify-center`}>
              <span className="text-xs font-bold text-white">{answeredCount}/{dimensions.length}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
