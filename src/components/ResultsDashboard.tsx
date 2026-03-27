'use client';

import { motion } from 'framer-motion';
import { AssessmentResults, CompanyProfile } from '@/types/assessment';
import ScoreReveal from './ScoreReveal';
import RadarChart from './RadarChart';
import DimensionCard from './DimensionCard';

interface ResultsDashboardProps {
  results: AssessmentResults;
  profile: CompanyProfile;
  onGetReport: () => void;
}

const DIMENSION_INSIGHTS: Record<number, string> = {
  1: 'Critical gap — immediate action needed to build baseline capabilities.',
  2: 'Below average — focused investment in this area will close the gap.',
  3: 'Strong foundation — you are ready to scale in this dimension.',
  4: 'Industry-leading — maintain your competitive edge here.',
};

export default function ResultsDashboard({ results, profile, onGetReport }: ResultsDashboardProps) {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#0a1628]/80">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {profile.companyName} — AI Readiness Assessment
          </div>
        </motion.div>

        {/* Score */}
        <ScoreReveal
          score={results.overallScore}
          tier={results.maturityTier}
          tierLabel={results.tierLabel}
          tierTagline={results.tierTagline}
        />

        {/* Archetype / Leadership Profile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="bg-[#0f1d35] border border-blue-500/20 rounded-2xl p-6 mb-8 max-w-2xl mx-auto shadow-lg"
        >
          <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">Your AI Leadership Profile</div>
          <h3 className="text-2xl font-bold text-white mb-0.5 tracking-tight">{results.archetype.name}</h3>
          <p className="text-blue-400 text-sm italic mb-4">&ldquo;{results.archetype.tagline}&rdquo;</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{results.archetype.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <h4 className="text-blue-400 text-[10px] uppercase tracking-[0.15em] mb-2.5 font-semibold">Strengths</h4>
              <ul className="space-y-2">
                {results.archetype.strengths.map((s, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2.5">
                    <svg className="w-3.5 h-3.5 text-blue-400 mt-[3px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-amber-400 text-[10px] uppercase tracking-[0.15em] mb-2.5 font-semibold">Watch Outs</h4>
              <ul className="space-y-2">
                {results.archetype.watchOuts.map((w, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start gap-2.5">
                    <svg className="w-3.5 h-3.5 text-amber-400 mt-[3px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                    </svg>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1a2d4d]">
            <span className="text-slate-500 text-xs">Best fit: </span>
            <span className="text-white text-sm font-semibold">{results.archetype.smartforgeFit}</span>
          </div>
        </motion.div>

        {/* Two-column layout: Radar + Dimensions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart with insights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold text-white mb-1">Your AI Readiness Profile</h3>
            <p className="text-xs text-slate-500 mb-4">
              <span className="inline-block w-3 h-0.5 bg-blue-500 mr-1 align-middle rounded" /> Your Score
              <span className="mx-2 text-slate-700">|</span>
              <span className="inline-block w-3 h-0.5 bg-slate-500 mr-1 align-middle rounded border-dashed" /> Industry Avg
            </p>
            <RadarChart scores={results.dimensionScores} />

            {/* Radar insights */}
            <div className="mt-4 space-y-2">
              {results.dimensionScores.map((s) => (
                <div key={s.dimensionId} className="flex items-start gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    s.score >= 3 ? 'bg-emerald-500' : s.score >= 2 ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <span className="text-slate-300 font-medium">{s.shortName}:</span>{' '}
                    <span className="text-slate-500">
                      {DIMENSION_INSIGHTS[s.score]}{' '}
                      {s.gap >= 0
                        ? `You're ${s.gap.toFixed(1)} pts ahead of peers.`
                        : `Peers are ${Math.abs(s.gap).toFixed(1)} pts ahead.`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dimension Breakdown */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-sm font-semibold text-white mb-3"
            >
              Dimension Breakdown
            </motion.h3>
            <div className="space-y-2">
              {results.dimensionScores.map((score, i) => (
                <DimensionCard key={score.dimensionId} score={score} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="card p-5"
          >
            <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Your Strengths
            </h3>
            <ul className="space-y-2">
              {results.strengths.map((s) => (
                <li key={s.dimensionId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{s.dimensionName}</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">{s.score}/4</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.4 }}
            className="card p-5"
          >
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Priority Gaps
            </h3>
            <ul className="space-y-2">
              {results.gaps.map((g) => (
                <li key={g.dimensionId} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{g.dimensionName}</span>
                  <span className="text-amber-400 font-semibold tabular-nums">{g.score}/4</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Recommended Next Steps</h3>
          <div className="space-y-3">
            {results.recommendations.map((rec, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      rec.impact === 'high'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-blue-500/15 text-blue-400'
                    }`}>
                      {i + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    rec.impact === 'high'
                      ? 'text-red-400 bg-red-500/10 border-red-500/20'
                      : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                  }`}>
                    {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{rec.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {rec.timeline}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                    </svg>
                    {rec.module}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Maturity Scale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.4 }}
          className="card p-5 mb-8"
        >
          <h3 className="text-sm font-semibold text-white mb-3">AI Maturity Scale</h3>
          <div className="relative">
            <div className="maturity-bar h-2 w-full mb-2" />
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `${results.overallScore}%` }}
              transition={{ delay: 2.2, duration: 0.8, ease: 'easeOut' }}
              className="absolute top-[-4px] w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-lg"
              style={{ transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-3">
            <span>AI Curious</span>
            <span>AI Exploring</span>
            <span>AI Scaling</span>
            <span>AI Leading</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.4 }}
          className="text-center"
        >
          <p className="text-slate-400 text-sm mb-4">
            Get your full personalized AI Readiness Report with detailed benchmarks and implementation roadmap.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetReport}
            className="px-10 py-4 bg-[#ff5722] hover:bg-[#ff6d3a] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#ff5722]/25 cta-pulse transition-colors cursor-pointer"
          >
            Download Full Report →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
