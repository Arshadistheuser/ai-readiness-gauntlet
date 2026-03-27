'use client';

import { motion } from 'framer-motion';
import { AssessmentResults, CompanyProfile } from '@/types/assessment';

interface ThankYouProps {
  results: AssessmentResults;
  profile: CompanyProfile;
  onRestart: () => void;
}

export default function ThankYou({ results, profile, onRestart }: ThankYouProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#0a1628]/80">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Your Report Is Ready
        </h2>
        <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
          View your personalized AI Readiness Report with detailed benchmarks,
          radar chart, and recommended next steps.
        </p>

        {/* Score summary */}
        <div className="card p-5 mb-8 max-w-sm mx-auto">
          <div className="text-xs text-slate-500 mb-1">{profile.companyName}</div>
          <div className="text-4xl font-bold text-blue-400 tabular-nums mb-1">
            {results.overallScore}/100
          </div>
          <div className="text-sm text-slate-400 mb-3">{results.tierLabel}</div>
          <div className="text-xs text-slate-500 italic">&ldquo;{results.tierTagline}&rdquo;</div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-8">
          <a
            href="/report"
            className="block w-full py-4 bg-[#ff5722] hover:bg-[#ff6d3a] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#ff5722]/25 transition-colors text-center cta-pulse"
          >
            View & Download Your Report
          </a>
          <a
            href="https://www.korcomptenz.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-[#0f1d35] border border-blue-500/30 hover:border-blue-500/60 text-blue-400 text-base font-semibold rounded-xl transition-colors text-center"
          >
            Book a SmartForge Demo
          </a>
        </div>

        <button
          onClick={onRestart}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors cursor-pointer"
        >
          Take the Assessment Again
        </button>

        {/* Branding */}
        <div className="mt-12 pt-6 border-t border-[#1a2d4d]">
          <p className="text-slate-600 text-xs">
            Powered by Korcomptenz &middot; SmartForge AI Platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}
