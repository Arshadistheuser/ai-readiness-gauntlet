'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentResults, CompanyProfile } from '@/types/assessment';

interface EmailCaptureProps {
  results: AssessmentResults;
  profile: CompanyProfile;
  onComplete: () => void;
}

export default function EmailCapture({ results, profile, onComplete }: EmailCaptureProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = firstName.trim() && lastName.trim() && email.includes('@');

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          company: profile.companyName,
          industry: profile.industry,
          companySize: profile.companySize,
          role: profile.role,
          aiReadinessScore: results.overallScore,
          maturityTier: results.tierLabel,
          topGap: results.gaps[0]?.dimensionName || '',
          topStrength: results.strengths[0]?.dimensionName || '',
        }),
      });
    } catch {
      // Proceed even if API fails
    }

    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#0a1628]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5"
          >
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
            Get Your Full Report
          </h2>
          <p className="text-slate-400 text-sm">
            Receive a personalized AI Readiness Report with detailed benchmarks,
            gap analysis, and a prioritized implementation roadmap.
          </p>
        </div>

        {/* Score preview */}
        <div className="card p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Your Score</div>
            <div className="text-2xl font-bold text-blue-400 tabular-nums">{results.overallScore}/100</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">Maturity Tier</div>
            <div className="text-sm font-semibold text-white">{results.tierLabel}</div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="px-4 py-3 bg-[#0f1d35] border border-[#1a2d4d] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="px-4 py-3 bg-[#0f1d35] border border-[#1a2d4d] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="w-full px-4 py-3 bg-[#0f1d35] border border-[#1a2d4d] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          />
          <input
            type="text"
            value={profile.companyName}
            disabled
            className="w-full px-4 py-3 bg-[#0a1220] border border-[#1a2d4d] rounded-xl text-slate-500 text-sm cursor-not-allowed"
          />
        </div>

        <motion.button
          whileHover={canSubmit ? { scale: 1.015 } : {}}
          whileTap={canSubmit ? { scale: 0.985 } : {}}
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={`w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer ${
            canSubmit && !submitting
              ? 'bg-[#ff5722] hover:bg-[#ff6d3a] text-white shadow-lg shadow-[#ff5722]/25'
              : 'bg-[#0f1d35] text-slate-600 cursor-not-allowed border border-[#1a2d4d]'
          }`}
        >
          {submitting ? 'Sending...' : 'Send My Report →'}
        </motion.button>

        <p className="text-slate-600 text-xs mt-3 text-center">
          We respect your privacy. Your data is used only to deliver your assessment results.
        </p>
      </motion.div>
    </div>
  );
}
