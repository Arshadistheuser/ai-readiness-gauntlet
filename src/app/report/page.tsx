'use client';

import { useEffect, useState } from 'react';
import AIReadinessReport from '@/components/report/AIReadinessReport';
import { AssessmentResults, CompanyProfile } from '@/types/assessment';

interface ReportData {
  results: AssessmentResults;
  profile: CompanyProfile;
  generatedAt: string;
}

export default function ReportPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ai-readiness-report');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        console.error('Failed to parse report data');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm">Loading report...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">No Report Data Found</h1>
          <p className="text-gray-500 text-sm mb-6">
            Please complete the AI Readiness Gauntlet assessment first to generate your personalized report.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#ff5722] text-white rounded-xl font-semibold text-sm hover:bg-[#ff6d3a] transition-colors"
          >
            Start the Assessment
          </a>
        </div>
      </div>
    );
  }

  return <AIReadinessReport data={data} />;
}
