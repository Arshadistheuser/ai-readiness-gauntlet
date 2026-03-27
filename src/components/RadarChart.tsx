'use client';

import { motion } from 'framer-motion';
import { DimensionScore } from '@/types/assessment';

interface RadarChartProps {
  scores: DimensionScore[];
}

const SIZE = 300;
const CENTER = SIZE / 2;
const MAX_RADIUS = 120;
const LEVELS = 4;

function polarToCartesian(angle: number, radius: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)];
}

function getPolygonPoints(values: number[], max: number): string {
  const step = 360 / values.length;
  return values
    .map((val, i) => {
      const radius = (val / max) * MAX_RADIUS;
      const [x, y] = polarToCartesian(i * step, radius);
      return `${x},${y}`;
    })
    .join(' ');
}

export default function RadarChart({ scores }: RadarChartProps) {
  const step = 360 / scores.length;

  const userValues = scores.map((s) => s.score);
  const benchmarkValues = scores.map((s) => s.benchmark);

  const userPoints = getPolygonPoints(userValues, LEVELS);
  const benchmarkPoints = getPolygonPoints(benchmarkValues, LEVELS);

  return (
    <div className="flex justify-center">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[320px] radar-glow">
        {/* Grid circles */}
        {Array.from({ length: LEVELS }, (_, i) => {
          const r = ((i + 1) / LEVELS) * MAX_RADIUS;
          const points = Array.from({ length: scores.length }, (_, j) => {
            const [x, y] = polarToCartesian(j * step, r);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={`grid-${i}`}
              points={points}
              fill="none"
              stroke="#1a2d4d"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Axis lines */}
        {scores.map((_, i) => {
          const [x, y] = polarToCartesian(i * step, MAX_RADIUS);
          return (
            <line
              key={`axis-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#1a2d4d"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Benchmark polygon */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          points={benchmarkPoints}
          fill="rgba(100, 116, 139, 0.08)"
          stroke="#64748b"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* User score polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          points={userPoints}
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3b82f6"
          strokeWidth={2}
        />

        {/* User score dots */}
        {userValues.map((val, i) => {
          const radius = (val / LEVELS) * MAX_RADIUS;
          const [x, y] = polarToCartesian(i * step, radius);
          return (
            <motion.circle
              key={`dot-${i}`}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 4 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
              cx={x}
              cy={y}
              fill="#3b82f6"
              stroke="#0a1628"
              strokeWidth={2}
            />
          );
        })}

        {/* Axis labels */}
        {scores.map((score, i) => {
          const [x, y] = polarToCartesian(i * step, MAX_RADIUS + 20);
          return (
            <motion.text
              key={`label-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[9px] font-medium"
              fill="#94a3b8"
            >
              {score.shortName}
            </motion.text>
          );
        })}

        {/* Level labels */}
        {Array.from({ length: LEVELS }, (_, i) => {
          const r = ((i + 1) / LEVELS) * MAX_RADIUS;
          const [x, y] = polarToCartesian(0, r);
          return (
            <text
              key={`level-${i}`}
              x={x + 8}
              y={y - 4}
              className="text-[7px]"
              fill="#475569"
            >
              L{i + 1}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
