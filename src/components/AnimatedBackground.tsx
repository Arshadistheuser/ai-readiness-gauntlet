'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background image */}
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/hero-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

      {/* Large floating orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, -25, 35, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -15, 25, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        className="absolute top-[50%] right-[20%] w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)' }}
      />

      {/* Subtle floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${10 + (i * 37) % 80}vw`,
            y: `${5 + (i * 53) % 90}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${5 + (i * 53) % 90}vh`, `${(5 + (i * 53) % 90) - 8 - (i % 5) * 3}vh`, `${5 + (i * 53) % 90}vh`],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 8 + (i % 7) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.7,
          }}
          className="absolute"
          style={{ left: `${10 + (i * 37) % 80}%` }}
        >
          <div
            className={`rounded-full ${
              i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-purple-500' : 'bg-emerald-500'
            }`}
            style={{
              width: `${1.5 + (i % 3)}px`,
              height: `${1.5 + (i % 3)}px`,
              opacity: 0.3 + (i % 4) * 0.1,
            }}
          />
        </motion.div>
      ))}

      {/* Connecting lines (neural network effect) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <motion.line
          x1="10%" y1="20%" x2="30%" y2="40%"
          stroke="#3b82f6" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="70%" y1="15%" x2="50%" y2="45%"
          stroke="#8b5cf6" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.line
          x1="80%" y1="60%" x2="60%" y2="30%"
          stroke="#10b981" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.line
          x1="20%" y1="70%" x2="45%" y2="55%"
          stroke="#3b82f6" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.line
          x1="55%" y1="80%" x2="85%" y2="40%"
          stroke="#8b5cf6" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.line
          x1="35%" y1="10%" x2="65%" y2="25%"
          stroke="#10b981" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </svg>

      {/* Top and bottom gradient fade for depth */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a1628] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent" />
    </div>
  );
}
