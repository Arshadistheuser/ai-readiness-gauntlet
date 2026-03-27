'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dimension, MaturityLevel } from '@/types/assessment';
import { dimensions } from '@/data/dimensions';

interface AssessmentQuestionProps {
  questionIndex: number;
  selectedAnswer: MaturityLevel | undefined;
  onAnswer: (dimensionId: string, level: MaturityLevel) => void;
  onNext: () => void;
}

const DIMENSION_ICONS = [
  // Data Foundation
  <svg key="data" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
  </svg>,
  // AI/ML
  <svg key="ai" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>,
  // Cloud
  <svg key="cloud" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  </svg>,
  // Governance
  <svg key="gov" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  // Talent
  <svg key="talent" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>,
  // Strategy
  <svg key="strategy" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>,
  // Value
  <svg key="value" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
];

const LEVEL_COLORS = [
  'border-amber-500/30 bg-amber-500/5',
  'border-blue-500/30 bg-blue-500/5',
  'border-emerald-500/30 bg-emerald-500/5',
  'border-purple-500/30 bg-purple-500/5',
];

const LEVEL_ACTIVE_COLORS = [
  'border-amber-500 bg-amber-500/15 shadow-amber-500/20',
  'border-blue-500 bg-blue-500/15 shadow-blue-500/20',
  'border-emerald-500 bg-emerald-500/15 shadow-emerald-500/20',
  'border-purple-500 bg-purple-500/15 shadow-purple-500/20',
];

const LEVEL_TEXT_COLORS = [
  'text-amber-400',
  'text-blue-400',
  'text-emerald-400',
  'text-purple-400',
];

export default function AssessmentQuestion({
  questionIndex,
  selectedAnswer,
  onAnswer,
  onNext,
}: AssessmentQuestionProps) {
  const dimension = dimensions[questionIndex];
  const [localSelection, setLocalSelection] = useState<MaturityLevel | undefined>(selectedAnswer);

  const handleSelect = (level: MaturityLevel) => {
    setLocalSelection(level);
    onAnswer(dimension.id, level);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0a1628]">
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-3xl w-full"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Dimension {questionIndex + 1} of {dimensions.length}
            </span>
            <span className="text-xs text-slate-500">
              {Math.round(((questionIndex) / dimensions.length) * 100)}% complete
            </span>
          </div>
          <div className="flex gap-1.5">
            {dimensions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < questionIndex
                    ? 'bg-blue-500'
                    : i === questionIndex
                    ? 'bg-blue-400 animate-pulse'
                    : 'bg-[#1a2d4d]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dimension Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            {DIMENSION_ICONS[questionIndex]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{dimension.name}</h2>
          </div>
        </div>

        {/* Scenario */}
        <div className="card p-5 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed italic">
            &ldquo;{dimension.scenario}&rdquo;
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {dimension.options.map((option, i) => {
            const isSelected = localSelection === option.level;
            return (
              <motion.button
                key={option.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelect(option.level)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${LEVEL_ACTIVE_COLORS[i]} shadow-lg`
                    : `${LEVEL_COLORS[i]} hover:border-slate-500/50`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? `${LEVEL_TEXT_COLORS[i]} border-current`
                      : 'border-slate-600'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-current"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold mb-1 ${isSelected ? LEVEL_TEXT_COLORS[i] : 'text-slate-200'}`}>
                      {option.label}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  <div className={`text-xs font-mono px-2 py-0.5 rounded ${
                    isSelected ? `${LEVEL_TEXT_COLORS[i]} opacity-80` : 'text-slate-600'
                  }`}>
                    L{option.level}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={localSelection ? { scale: 1.015 } : {}}
          whileTap={localSelection ? { scale: 0.985 } : {}}
          onClick={() => {
            if (localSelection) onNext();
          }}
          disabled={!localSelection}
          className={`w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer ${
            localSelection
              ? 'bg-[#ff5722] hover:bg-[#ff6d3a] text-white shadow-lg shadow-[#ff5722]/25'
              : 'bg-[#0f1d35] text-slate-600 cursor-not-allowed border border-[#1a2d4d]'
          }`}
        >
          {localSelection
            ? questionIndex === dimensions.length - 1
              ? 'See Your Results →'
              : 'Next Dimension →'
            : 'Select an option to continue'}
        </motion.button>
      </motion.div>
    </div>
  );
}
