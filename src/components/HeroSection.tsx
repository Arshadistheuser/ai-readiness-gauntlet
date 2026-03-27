'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const START = 2;
    let mode: 'forward' | 'reverse' = 'forward';
    let slowed = false;
    let prevTick = 0;

    video.currentTime = START;
    video.playbackRate = 1;
    video.loop = false;

    // Single RAF loop that polls video state — no events to miss
    const tick = (now: number) => {
      if (mode === 'forward') {
        // Slow down after first 2s of playback
        if (!slowed && video.currentTime >= START + 2) {
          slowed = true;
          video.playbackRate = 0.5;
        }
        // Detect end: check both .ended property and near-duration
        const atEnd = video.ended ||
          (video.duration > 0 && !isNaN(video.duration) && video.currentTime >= video.duration - 0.15);
        if (atEnd) {
          video.pause();
          mode = 'reverse';
          prevTick = now;
        }
      } else {
        // Reverse: manually step currentTime backward at 0.5x
        const dt = (now - prevTick) / 1000;
        prevTick = now;
        const newTime = video.currentTime - dt * 0.5;
        if (newTime <= START) {
          // Reverse complete → restart forward
          video.currentTime = START;
          mode = 'forward';
          slowed = false;
          video.playbackRate = 1;
          video.play().catch(() => {});
        } else {
          video.currentTime = newTime;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    // Start everything
    const begin = () => {
      video.play().catch(() => {});
      prevTick = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    };

    if (video.readyState >= 3) {
      begin();
    } else {
      video.addEventListener('canplay', begin, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('canplay', begin);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.3) saturate(0.8)' }}
      >
        <source src="/hero-robot.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/40 to-[#0a1628]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/60 via-transparent to-[#0a1628]/60" />

      {/* SVG background as fallback / texture layer */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url(/hero-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[15%] w-32 h-32 rounded-full bg-blue-500/5 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 right-[20%] w-48 h-48 rounded-full bg-purple-500/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-[10%] w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 backdrop-blur-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Play 6: Cloud, Data & AI
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          <span className="text-white drop-shadow-lg">AI Readiness</span>{' '}
          <span className="gradient-text">Gauntlet</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-slate-300 text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed drop-shadow"
        >
          Benchmark your organization&apos;s AI maturity across 7 critical dimensions.
          Get a personalized readiness score and actionable roadmap.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { icon: '7', label: 'Dimensions' },
            { icon: '3', label: 'Minutes' },
            { icon: '\u2713', label: 'Personalized Roadmap' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f1d35]/80 border border-[#1a2d4d] text-sm backdrop-blur-sm"
            >
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                {badge.icon}
              </span>
              <span className="text-slate-300">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="px-10 py-4 bg-[#ff5722] hover:bg-[#ff6d3a] text-white text-lg font-semibold rounded-xl shadow-lg shadow-[#ff5722]/25 cta-pulse transition-colors cursor-pointer"
        >
          Start Your Assessment →
        </motion.button>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-slate-500 text-xs mt-6"
        >
          Benchmarked against 500+ enterprise assessments · No login required
        </motion.p>
      </motion.div>
    </div>
  );
}
