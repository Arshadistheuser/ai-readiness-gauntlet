'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAssessmentState } from '@/hooks/useAssessmentState';
import AnimatedBackground from '@/components/AnimatedBackground';
import HeroSection from '@/components/HeroSection';
import CompanySetup from '@/components/CompanySetup';
import AssessmentQuestion from '@/components/AssessmentQuestion';
import DimensionTransition from '@/components/DimensionTransition';
import LiveScoreBar from '@/components/LiveScoreBar';
import ResultsDashboard from '@/components/ResultsDashboard';
import EmailCapture from '@/components/EmailCapture';
import ThankYou from '@/components/ThankYou';

export default function Home() {
  const [state, dispatch] = useAssessmentState();
  const [showTransition, setShowTransition] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState(0);
  const [transitionTo, setTransitionTo] = useState(1);

  const handleNextQuestion = useCallback(() => {
    const from = state.currentQuestion;
    const to = from + 1;
    setTransitionFrom(from);
    setTransitionTo(to);
    setShowTransition(true);

    setTimeout(() => {
      dispatch({ type: 'NEXT_QUESTION' });
      setShowTransition(false);
    }, 1500);
  }, [state.currentQuestion, dispatch]);

  const handleEmailComplete = useCallback(() => {
    if (state.results && state.companyProfile) {
      try {
        localStorage.setItem('ai-readiness-report', JSON.stringify({
          results: state.results,
          profile: state.companyProfile,
          generatedAt: new Date().toISOString(),
        }));
      } catch {
        // localStorage may be unavailable
      }
    }
    dispatch({ type: 'COMPLETE_EMAIL' });
  }, [state.results, state.companyProfile, dispatch]);

  return (
    <main className="min-h-screen bg-[#0a1628] relative">
      <AnimatedBackground />

      {/* Transition overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DimensionTransition fromIndex={transitionFrom} toIndex={transitionTo} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {state.phase === 'landing' && (
            <motion.div
              key="landing"
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onStart={() => dispatch({ type: 'START_SETUP' })} />
            </motion.div>
          )}

          {state.phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <CompanySetup
                onComplete={(profile) => dispatch({ type: 'COMPLETE_SETUP', profile })}
              />
            </motion.div>
          )}

          {state.phase === 'assessing' && !showTransition && (
            <motion.div
              key={`question-${state.currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <LiveScoreBar answers={state.answers} currentQuestion={state.currentQuestion} />
              <AssessmentQuestion
                questionIndex={state.currentQuestion}
                selectedAnswer={state.answers[Object.keys(state.answers)[state.currentQuestion]]}
                onAnswer={(dimensionId, level) =>
                  dispatch({ type: 'ANSWER_QUESTION', dimensionId, level })
                }
                onNext={handleNextQuestion}
              />
            </motion.div>
          )}

          {state.phase === 'results' && state.results && state.companyProfile && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ResultsDashboard
                results={state.results}
                profile={state.companyProfile}
                onGetReport={() => dispatch({ type: 'SHOW_EMAIL_CAPTURE' })}
              />
            </motion.div>
          )}

          {state.phase === 'emailCapture' && state.results && state.companyProfile && (
            <motion.div
              key="email"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <EmailCapture
                results={state.results}
                profile={state.companyProfile}
                onComplete={handleEmailComplete}
              />
            </motion.div>
          )}

          {state.phase === 'thankYou' && state.results && state.companyProfile && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ThankYou
                results={state.results}
                profile={state.companyProfile}
                onRestart={() => dispatch({ type: 'RESTART' })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
