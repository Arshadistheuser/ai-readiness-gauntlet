'use client';

import { useRef, useState } from 'react';
import { AssessmentResults, CompanyProfile, DimensionScore } from '@/types/assessment';

interface ReportData {
  results: AssessmentResults;
  profile: CompanyProfile;
  generatedAt: string;
}

interface AIReadinessReportProps {
  data: ReportData;
}

function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = score >= 76 ? '#8b5cf6' : score >= 51 ? '#10b981' : score >= 26 ? '#3b82f6' : '#f59e0b';
  return (
    <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset} />
    </svg>
  );
}

function StaticRadarChart({ scores }: { scores: DimensionScore[] }) {
  const size = 260;
  const center = size / 2;
  const maxRadius = 100;
  const levels = 4;
  const step = 360 / scores.length;

  function polar(angle: number, radius: number): [number, number] {
    const rad = (angle - 90) * (Math.PI / 180);
    return [center + radius * Math.cos(rad), center + radius * Math.sin(rad)];
  }

  function polygon(values: number[]): string {
    return values.map((v, i) => {
      const r = (v / levels) * maxRadius;
      const [x, y] = polar(i * step, r);
      return `${x},${y}`;
    }).join(' ');
  }

  const userPoints = polygon(scores.map(s => s.score));
  const benchPoints = polygon(scores.map(s => s.benchmark));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="260" height="260">
      {/* Grid */}
      {Array.from({ length: levels }, (_, i) => {
        const r = ((i + 1) / levels) * maxRadius;
        const pts = Array.from({ length: scores.length }, (_, j) => {
          const [x, y] = polar(j * step, r);
          return `${x},${y}`;
        }).join(' ');
        return <polygon key={i} points={pts} fill="none" stroke="#e5e7eb" strokeWidth={0.5} />;
      })}

      {/* Axes */}
      {scores.map((_, i) => {
        const [x, y] = polar(i * step, maxRadius);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e5e7eb" strokeWidth={0.5} />;
      })}

      {/* Benchmark */}
      <polygon points={benchPoints} fill="rgba(148,163,184,0.08)" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />

      {/* User */}
      <polygon points={userPoints} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth={2} />

      {/* Dots + Labels */}
      {scores.map((s, i) => {
        const r = (s.score / levels) * maxRadius;
        const [dx, dy] = polar(i * step, r);
        const [lx, ly] = polar(i * step, maxRadius + 16);
        return (
          <g key={i}>
            <circle cx={dx} cy={dy} r={3.5} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#64748b" fontWeight="500">
              {s.shortName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DimensionBar({ score, color }: { score: DimensionScore; color: string }) {
  const w = (score.score / 4) * 100;
  const benchPos = (score.benchmark / 4) * 100;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-700 text-xs font-medium">{score.dimensionName}</span>
        <span className="text-gray-900 text-xs font-bold">{score.score}/4</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${w}%` }} />
        <div className="absolute top-[-2px] w-0.5 h-[12px] bg-gray-400 rounded" style={{ left: `${benchPos}%` }} />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-gray-400 text-[9px]">Benchmark: {score.benchmark.toFixed(1)}</span>
        <span className={`text-[9px] font-medium ${score.gap >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
          {score.gap >= 0 ? '+' : ''}{score.gap.toFixed(1)} vs avg
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#0a1628] flex items-center justify-center text-white text-sm font-bold shrink-0">
        {number}
      </div>
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
    </div>
  );
}

function PageBreak() {
  return <div style={{ pageBreakBefore: 'always' }} />;
}

const TIER_COLORS: Record<string, string> = {
  'ai-curious': 'bg-amber-50 text-amber-700 border-amber-200',
  'ai-exploring': 'bg-blue-50 text-blue-700 border-blue-200',
  'ai-scaling': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'ai-leading': 'bg-purple-50 text-purple-700 border-purple-200',
};

const BAR_COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];

export default function AIReadinessReport({ data }: AIReadinessReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const { results, profile } = data;
  const dateStr = new Date(data.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const tierStyle = TIER_COLORS[results.maturityTier] || TIER_COLORS['ai-curious'];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js' as any)).default;
      const element = reportRef.current;
      if (!element) return;

      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `AI-Readiness-Report-${profile.companyName.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'], before: '.page-break' },
      }).from(element).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-[850px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/korcomptenz-logo.png" alt="Korcomptenz" className="h-7 w-auto" />
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 text-sm font-medium">AI Readiness Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Print
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#ff5722] hover:bg-[#ff6d3a] rounded-lg transition-colors disabled:opacity-50"
            >
              {downloading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Report content */}
      <div ref={reportRef} className="max-w-[850px] mx-auto bg-white shadow-lg my-8 print:shadow-none print:my-0">

        {/* ================================================================ */}
        {/* COVER PAGE */}
        {/* ================================================================ */}
        <div className="px-12 pt-16 pb-12 min-h-[800px] flex flex-col">
          <div className="flex items-center justify-between mb-16">
            <img src="/korcomptenz-logo.png" alt="Korcomptenz" className="h-10 w-auto" />
            <div className="text-right">
              <div className="text-gray-900 font-semibold text-sm">{profile.companyName}</div>
              <div className="text-gray-400 text-xs">{profile.role}</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.2em] text-[#3b82f6] font-semibold mb-4">
              Confidential &mdash; Prepared exclusively for {profile.companyName}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0a1628] tracking-tight leading-tight mb-4">
              AI Readiness<br />Assessment Report
            </h1>
            <p className="text-gray-500 text-lg mb-10 max-w-lg">
              Personalized analysis based on your AI Readiness Gauntlet assessment results, with actionable recommendations powered by SmartForge.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-[#0a1628]">{results.overallScore}</div>
                <div className="text-gray-500 text-xs mt-1">Readiness Score</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-sm font-bold text-[#0a1628] leading-tight">{results.tierLabel}</div>
                <div className="text-gray-500 text-xs mt-1">Maturity Tier</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-sm font-bold text-[#0a1628] leading-tight">7</div>
                <div className="text-gray-500 text-xs mt-1">Dimensions Assessed</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-auto flex items-center justify-between text-sm text-gray-400">
            <span>Prepared by Korcomptenz &mdash; SmartForge AI Platform</span>
            <span>{dateStr}</span>
          </div>
        </div>

        <PageBreak />

        {/* ================================================================ */}
        {/* EXECUTIVE SUMMARY */}
        {/* ================================================================ */}
        <div className="px-12 py-12">
          <SectionTitle number={1} title="Executive Summary" />

          <div className="flex items-start gap-8 mb-8">
            <div className="shrink-0 relative">
              <ScoreRing score={results.overallScore} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{results.overallScore}</span>
                <span className="text-gray-400 text-xs">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierStyle}`}>
                  {results.tierLabel}
                </span>
              </div>
              <p className="text-gray-500 text-sm italic mb-4">&ldquo;{results.tierTagline}&rdquo;</p>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{results.tierDescription}</p>
              </div>
            </div>
          </div>

          {/* Maturity Scale */}
          <div className="mb-8">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Maturity Position</div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #f59e0b, #3b82f6, #10b981, #8b5cf6)' }}>
              <div
                className="absolute top-[-2px] w-4 h-[18px] rounded-full bg-white border-2 border-gray-800 shadow"
                style={{ left: `${results.overallScore}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
              <span>AI Curious (0-25)</span>
              <span>AI Exploring (26-50)</span>
              <span>AI Scaling (51-75)</span>
              <span>AI Leading (76-100)</span>
            </div>
          </div>
        </div>

        <PageBreak />

        {/* ================================================================ */}
        {/* RADAR CHART + DIMENSIONS */}
        {/* ================================================================ */}
        <div className="px-12 py-12">
          <SectionTitle number={2} title="AI Readiness Profile" />
          <p className="text-gray-500 text-sm mb-8">
            Your scores across 7 critical AI readiness dimensions, benchmarked against industry peers in the {profile.industry.replace(/-/g, ' ')} sector.
          </p>

          <div className="flex gap-8 mb-8">
            <div className="shrink-0">
              <StaticRadarChart scores={results.dimensionScores} />
              <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-blue-500 inline-block" /> Your Score
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-gray-400 inline-block border-dashed" /> Industry Avg
                </span>
              </div>
            </div>
            <div className="flex-1">
              {results.dimensionScores.map((s, i) => (
                <DimensionBar key={s.dimensionId} score={s} color={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </div>
          </div>
        </div>

        <PageBreak />

        {/* ================================================================ */}
        {/* STRENGTHS & GAPS */}
        {/* ================================================================ */}
        <div className="px-12 py-12">
          <SectionTitle number={3} title="Strengths & Gap Analysis" />

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-emerald-600 font-semibold mb-3">Your Top Strengths</h4>
              <div className="space-y-3">
                {results.strengths.map((s) => (
                  <div key={s.dimensionId} className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900 text-sm font-semibold">{s.dimensionName}</span>
                      <span className="text-emerald-700 font-bold text-sm">{s.score}/4</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      {s.gap >= 0 ? `${s.gap.toFixed(1)} points above` : `${Math.abs(s.gap).toFixed(1)} points below`} industry average ({s.benchmark.toFixed(1)})
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-3">Priority Gaps</h4>
              <div className="space-y-3">
                {results.gaps.map((g) => (
                  <div key={g.dimensionId} className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900 text-sm font-semibold">{g.dimensionName}</span>
                      <span className="text-amber-700 font-bold text-sm">{g.score}/4</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      {g.gap >= 0 ? `${g.gap.toFixed(1)} points above` : `${Math.abs(g.gap).toFixed(1)} points below`} industry average ({g.benchmark.toFixed(1)})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PageBreak />

        {/* ================================================================ */}
        {/* RECOMMENDATIONS */}
        {/* ================================================================ */}
        <div className="px-12 py-12">
          <SectionTitle number={4} title="Recommended Action Plan" />
          <p className="text-gray-500 text-sm mb-8">
            Prioritized recommendations based on your gap analysis, each tied to a specific Korcomptenz capability that can accelerate your progress.
          </p>

          <div className="space-y-5">
            {results.recommendations.map((rec, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#0a1628] flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">{rec.title}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    rec.impact === 'high'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed">{rec.description}</p>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Timeline</div>
                      <div className="text-gray-900 text-sm font-medium">{rec.timeline}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Solution Module</div>
                      <div className="text-gray-900 text-sm font-medium">{rec.module}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PageBreak />

        {/* ================================================================ */}
        {/* ABOUT + CTA */}
        {/* ================================================================ */}
        <div className="px-12 py-12">
          <SectionTitle number={5} title="Your Next Step" />

          <div className="bg-gradient-to-br from-[#0a1628] to-[#162845] rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center gap-4 mb-6">
              <img src="/korcomptenz-logo.png" alt="Korcomptenz" className="h-8 w-auto brightness-0 invert" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Ready to Accelerate Your AI Journey?</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your assessment indicates a <strong className="text-white">{results.tierLabel}</strong> maturity level.
              Let our SmartForge team design a tailored roadmap to move you to the next tier with measurable outcomes.
            </p>
            <div className="bg-white/10 rounded-xl p-5 mb-6">
              <h4 className="text-white font-semibold text-sm mb-3">Complimentary AI Strategy Workshop includes:</h4>
              <ul className="space-y-2">
                {[
                  'Deep-dive into your AI readiness gaps with domain experts',
                  'Custom SmartForge demo tailored to your industry use cases',
                  'Microsoft Fabric assessment for your data infrastructure',
                  'Prioritized 90-day AI acceleration roadmap',
                  'ROI modeling for your top 3 AI use cases',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <svg className="w-3.5 h-3.5 text-[#ff5722] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="https://www.korcomptenz.com/contact-us/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-[#ff5722] hover:bg-[#ff6d3a] text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Schedule Your Free Workshop &rarr;
            </a>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { value: '22+', label: 'Years of Excellence' },
              { value: '1,000+', label: 'Projects Delivered' },
              { value: '200+', label: 'Active Clients' },
              { value: 'ISG', label: 'Provider Lens Leader' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center text-gray-400 text-xs border-t border-gray-200 pt-6">
            <p>Microsoft Gold Partner &middot; SAP Solutions Partner &middot; ISO 27001:2022 Certified</p>
            <p className="mt-1">
              <a href="https://www.korcomptenz.com" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">
                www.korcomptenz.com
              </a>
              {' &middot; '}info@korcomptenz.com
            </p>
            <p className="mt-4 text-gray-300">
              This report was generated by the AI Readiness Gauntlet &mdash; an interactive AI maturity assessment by Korcomptenz.
              <br />Benchmarks are based on aggregated industry data and should be validated with a comprehensive AI assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
