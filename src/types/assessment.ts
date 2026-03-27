export type AssessmentPhase = 'landing' | 'setup' | 'assessing' | 'results' | 'emailCapture' | 'thankYou';

export interface CompanyProfile {
  companyName: string;
  industry: string;
  companySize: 'smb' | 'mid-market' | 'enterprise';
  role: string;
}

export type MaturityLevel = 1 | 2 | 3 | 4;

export interface MaturityOption {
  level: MaturityLevel;
  label: string;
  description: string;
}

export interface Dimension {
  id: string;
  name: string;
  shortName: string;
  scenario: string;
  options: MaturityOption[];
  benchmarks: Record<string, number>;
}

export interface DimensionScore {
  dimensionId: string;
  dimensionName: string;
  shortName: string;
  score: number;
  benchmark: number;
  gap: number;
}

export interface Recommendation {
  title: string;
  description: string;
  timeline: string;
  impact: 'high' | 'medium';
  module: string;
}

export interface ArchetypeResult {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  watchOuts: string[];
  smartforgeFit: string;
}

export interface AssessmentResults {
  overallScore: number;
  maturityTier: 'ai-curious' | 'ai-exploring' | 'ai-scaling' | 'ai-leading';
  tierLabel: string;
  tierTagline: string;
  tierDescription: string;
  archetype: ArchetypeResult;
  dimensionScores: DimensionScore[];
  strengths: DimensionScore[];
  gaps: DimensionScore[];
  recommendations: Recommendation[];
}

export type AssessmentAction =
  | { type: 'START_SETUP' }
  | { type: 'COMPLETE_SETUP'; profile: CompanyProfile }
  | { type: 'ANSWER_QUESTION'; dimensionId: string; level: MaturityLevel }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SHOW_EMAIL_CAPTURE' }
  | { type: 'COMPLETE_EMAIL' }
  | { type: 'RESTART' };

export interface AssessmentState {
  phase: AssessmentPhase;
  companyProfile: CompanyProfile | null;
  currentQuestion: number;
  answers: Record<string, MaturityLevel>;
  results: AssessmentResults | null;
}
