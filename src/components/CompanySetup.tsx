'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CompanyProfile } from '@/types/assessment';
import { industries, companySizes, roles } from '@/data/dimensions';

interface CompanySetupProps {
  onComplete: (profile: CompanyProfile) => void;
}

export default function CompanySetup({ onComplete }: CompanySetupProps) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);
  const [companySize, setCompanySize] = useState<CompanyProfile['companySize'] | null>(null);
  const [role, setRole] = useState('');

  const canProceed = companyName.trim() && industry && companySize && role;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[#0a1628]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Step 1 of 2
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Tell us about your organization
          </h2>
          <p className="text-slate-400 text-base">
            We&apos;ll benchmark your results against peers in your industry and size bracket.
          </p>
        </div>

        {/* Company Name */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-2 font-semibold px-1 block">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corporation"
            className="w-full px-4 py-3 bg-[#0f1d35] border border-[#1a2d4d] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          />
        </div>

        {/* Industry */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-2 font-semibold px-1 block">
            Industry
          </label>
          <div className="grid grid-cols-2 gap-2">
            {industries.map((ind, i) => (
              <motion.button
                key={ind.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03, duration: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIndustry(ind.id)}
                className={`relative p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border text-sm ${
                  industry === ind.id
                    ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-[#0f1d35] border-[#1a2d4d] hover:border-blue-500/40'
                }`}
              >
                <span className={`font-medium ${industry === ind.id ? 'text-blue-400' : 'text-slate-300'}`}>
                  {ind.label}
                </span>
                {industry === ind.id && (
                  <motion.div
                    layoutId="industry-check"
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Company Size */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-2 font-semibold px-1 block">
            Company Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {companySizes.map((size, i) => (
              <motion.button
                key={size.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCompanySize(size.id)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                  companySize === size.id
                    ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-[#0f1d35] border-[#1a2d4d] hover:border-blue-500/40'
                }`}
              >
                <div className={`text-sm font-semibold mb-0.5 ${companySize === size.id ? 'text-blue-400' : 'text-slate-200'}`}>
                  {size.label}
                </div>
                <div className="text-xs text-slate-500">{size.description}</div>
                {companySize === size.id && (
                  <motion.div
                    layoutId="size-check"
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Role */}
        <div className="mb-10">
          <label className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-2 font-semibold px-1 block">
            Your Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1d35] border border-[#1a2d4d] rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm appearance-none cursor-pointer"
          >
            <option value="" disabled className="text-slate-600">Select your role</option>
            {roles.map((r) => (
              <option key={r} value={r} className="bg-[#0f1d35]">{r}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={canProceed ? { scale: 1.015 } : {}}
          whileTap={canProceed ? { scale: 0.985 } : {}}
          onClick={() => {
            if (canProceed) {
              onComplete({
                companyName: companyName.trim(),
                industry: industry!,
                companySize: companySize!,
                role,
              });
            }
          }}
          disabled={!canProceed}
          className={`w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer ${
            canProceed
              ? 'bg-[#ff5722] hover:bg-[#ff6d3a] text-white shadow-lg shadow-[#ff5722]/25'
              : 'bg-[#0f1d35] text-slate-600 cursor-not-allowed border border-[#1a2d4d]'
          }`}
        >
          {canProceed ? 'Begin Assessment →' : 'Complete all fields to continue'}
        </motion.button>
      </motion.div>
    </div>
  );
}
