import { MaturityLevel, DimensionScore, AssessmentResults, Recommendation } from '@/types/assessment';
import { dimensions } from './dimensions';
import { determineArchetype } from './archetypes';

const TIER_CONFIG = {
  'ai-curious': {
    label: 'AI Curious',
    tagline: 'Your AI journey is just beginning',
    description: 'Your organization is in the early stages of AI awareness. The good news: you have a clean slate to build a strong foundation. Companies at this stage that invest strategically can leapfrog competitors who started earlier but built on shaky foundations.',
  },
  'ai-exploring': {
    label: 'AI Exploring',
    tagline: 'You\'re building the foundation',
    description: 'You\'ve started experimenting with AI but haven\'t yet scaled beyond pilots. This is a critical inflection point\u2014organizations that move decisively from exploration to execution see 3x faster time-to-value than those who stay in pilot purgatory.',
  },
  'ai-scaling': {
    label: 'AI Scaling',
    tagline: 'You\'re ready to accelerate',
    description: 'Your AI capabilities are maturing with multiple production use cases. You\'re well-positioned to drive enterprise-wide transformation. The key now is operationalizing AI across all business units and building a sustainable competitive moat.',
  },
  'ai-leading': {
    label: 'AI Leading',
    tagline: 'You\'re setting the benchmark',
    description: 'Your organization is an AI leader with enterprise-wide adoption and measurable business impact. Focus on maintaining your edge through continuous innovation, responsible AI practices, and talent retention.',
  },
} as const;

const RECOMMENDATIONS_BY_DIMENSION: Record<string, { low: Recommendation; mid: Recommendation }> = {
  'data-foundation': {
    low: {
      title: 'Establish a Unified Data Platform',
      description: 'Consolidate fragmented data sources into a governed data lakehouse. Start with your top 3 revenue-critical data domains and build automated ingestion pipelines.',
      timeline: '3\u20136 months',
      impact: 'high',
      module: 'SmartForge Data Foundation',
    },
    mid: {
      title: 'Implement Real-Time Data Quality',
      description: 'Deploy automated data quality monitoring with anomaly detection. Move from batch to streaming data pipelines for your most time-sensitive use cases.',
      timeline: '2\u20134 months',
      impact: 'medium',
      module: 'Microsoft Fabric Assessment',
    },
  },
  'ai-ml-capabilities': {
    low: {
      title: 'Launch a Focused AI Pilot Program',
      description: 'Identify 2\u20133 high-impact, low-risk use cases. Build an MLOps foundation from day one\u2014even for pilots\u2014to avoid rework when scaling.',
      timeline: '2\u20134 months',
      impact: 'high',
      module: 'SmartForge ML Studio',
    },
    mid: {
      title: 'Scale MLOps & Model Governance',
      description: 'Productionize your ML pipeline with automated model monitoring, versioning, and retraining. Reduce model deployment time from weeks to hours.',
      timeline: '3\u20136 months',
      impact: 'high',
      module: 'SmartForge ML Studio',
    },
  },
  'cloud-infrastructure': {
    low: {
      title: 'Accelerate Cloud Migration',
      description: 'Develop a cloud-first strategy prioritizing AI/ML workloads. Containerize key applications and establish infrastructure-as-code practices.',
      timeline: '4\u20138 months',
      impact: 'high',
      module: 'CKVal Cloud Assessment',
    },
    mid: {
      title: 'Optimize Cloud-Native Architecture',
      description: 'Implement serverless patterns for variable workloads. Add auto-scaling and edge deployment for latency-sensitive AI inference.',
      timeline: '2\u20134 months',
      impact: 'medium',
      module: 'CKVal Cloud Assessment',
    },
  },
  'governance-ethics': {
    low: {
      title: 'Build an AI Governance Framework',
      description: 'Establish an AI ethics board, create a model registry, and implement basic bias detection. This is increasingly a regulatory requirement, not just a best practice.',
      timeline: '2\u20133 months',
      impact: 'high',
      module: 'SmartForge Governance Suite',
    },
    mid: {
      title: 'Automate Compliance & Explainability',
      description: 'Deploy automated model cards, fairness metrics, and explainability reports. Shift from quarterly reviews to continuous compliance monitoring.',
      timeline: '3\u20135 months',
      impact: 'medium',
      module: 'SmartForge Governance Suite',
    },
  },
  'talent-culture': {
    low: {
      title: 'Launch an AI Literacy Program',
      description: 'Start with executive AI workshops, then cascade to business units. Hire 2\u20133 data translators who bridge technical and business teams.',
      timeline: '1\u20133 months',
      impact: 'high',
      module: 'Korcomptenz AI Advisory',
    },
    mid: {
      title: 'Build a Center of Excellence',
      description: 'Formalize cross-functional AI teams with clear career paths. Deploy citizen data scientist tools to democratize AI across the organization.',
      timeline: '3\u20136 months',
      impact: 'medium',
      module: 'Korcomptenz AI Advisory',
    },
  },
  'strategy-leadership': {
    low: {
      title: 'Define an AI-Aligned Business Strategy',
      description: 'Move AI from "innovation side project" to strategic imperative. Assign executive ownership, set measurable KPIs, and secure dedicated budget.',
      timeline: '1\u20132 months',
      impact: 'high',
      module: 'SmartForge Strategy Workshop',
    },
    mid: {
      title: 'Embed AI in Business Unit P&Ls',
      description: 'Transition from centralized AI budget to business-unit-owned AI targets. Create quarterly AI value reviews tied to revenue and efficiency metrics.',
      timeline: '2\u20134 months',
      impact: 'medium',
      module: 'SmartForge Strategy Workshop',
    },
  },
  'value-realization': {
    low: {
      title: 'Identify Quick-Win AI Use Cases',
      description: 'Map your highest-cost manual processes to AI automation opportunities. Focus on use cases with measurable ROI within 90 days to build organizational confidence.',
      timeline: '1\u20133 months',
      impact: 'high',
      module: 'SmartForge Discovery Workshop',
    },
    mid: {
      title: 'Build an AI Value Portfolio',
      description: 'Create a structured portfolio of AI use cases with measured business impact. Implement a scoring framework to prioritize scaling proven wins across the enterprise.',
      timeline: '2\u20134 months',
      impact: 'medium',
      module: 'SmartForge Discovery Workshop',
    },
  },
};

export function calculateResults(
  answers: Record<string, MaturityLevel>,
  industry: string
): AssessmentResults {
  const dimensionScores: DimensionScore[] = dimensions.map((dim) => {
    const score = answers[dim.id] || 1;
    const benchmark = dim.benchmarks[industry] || dim.benchmarks['other'] || 2.0;
    return {
      dimensionId: dim.id,
      dimensionName: dim.name,
      shortName: dim.shortName,
      score,
      benchmark,
      gap: score - benchmark,
    };
  });

  const rawAvg = dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length;
  const overallScore = Math.round(((rawAvg - 1) / 3) * 100);

  let maturityTier: AssessmentResults['maturityTier'];
  if (overallScore <= 25) maturityTier = 'ai-curious';
  else if (overallScore <= 50) maturityTier = 'ai-exploring';
  else if (overallScore <= 75) maturityTier = 'ai-scaling';
  else maturityTier = 'ai-leading';

  const config = TIER_CONFIG[maturityTier];

  const sorted = [...dimensionScores].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const gaps = [...dimensionScores].sort((a, b) => a.score - b.score).slice(0, 3);

  const recommendations: Recommendation[] = gaps.map((gap) => {
    const recSet = RECOMMENDATIONS_BY_DIMENSION[gap.dimensionId];
    if (!recSet) return null;
    return gap.score <= 2 ? recSet.low : recSet.mid;
  }).filter((r): r is Recommendation => r !== null);

  const archetype = determineArchetype(answers);

  return {
    overallScore,
    maturityTier,
    tierLabel: config.label,
    tierTagline: config.tagline,
    tierDescription: config.description,
    archetype,
    dimensionScores,
    strengths,
    gaps,
    recommendations,
  };
}
