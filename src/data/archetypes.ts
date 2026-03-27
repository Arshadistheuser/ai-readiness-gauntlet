import { MaturityLevel } from '@/types/assessment';

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  watchOuts: string[];
  smartforgeFit: string;
}

const archetypes: Archetype[] = [
  {
    id: 'data-architect',
    name: 'The Data Architect',
    tagline: 'Every AI breakthrough starts with the right data foundation',
    description: 'You understand that sustainable AI success is built on robust data fundamentals. Your instinct is to invest in infrastructure before algorithms — and that discipline puts you ahead of organizations chasing AI hype without the plumbing to support it.',
    strengths: [
      'Solid data foundations that accelerate every future AI initiative',
      'Infrastructure-first thinking reduces rework and technical debt',
      'Scalable approach that compounds returns over time',
    ],
    watchOuts: [
      'May over-invest in infrastructure at the expense of quick wins',
      'Risk of "analysis paralysis" — waiting for perfect data before starting AI',
      'Business stakeholders may lose patience without visible AI progress',
    ],
    smartforgeFit: 'SmartForge Data Foundation + Microsoft Fabric',
  },
  {
    id: 'innovation-catalyst',
    name: 'The Innovation Catalyst',
    tagline: 'Turn AI vision into competitive advantage',
    description: 'You\'re a technology-forward leader who sees AI as a strategic differentiator, not just an efficiency play. You push boundaries, secure executive buy-in, and aren\'t afraid to invest boldly in cutting-edge capabilities that competitors haven\'t yet imagined.',
    strengths: [
      'Bold vision that positions AI as competitive strategy, not cost play',
      'Strong executive alignment and dedicated AI investment',
      'Fast-moving teams that can respond quickly to market shifts',
    ],
    watchOuts: [
      'May outpace governance — regulators and risk teams can\'t keep up',
      'Risk of "pilot purgatory" if scaling discipline doesn\'t match ambition',
      'Talent retention is critical — innovation cultures attract poachers',
    ],
    smartforgeFit: 'SmartForge ML Studio + Strategy Workshop',
  },
  {
    id: 'responsible-pioneer',
    name: 'The Responsible Pioneer',
    tagline: 'Build AI that your board, regulators, and customers trust',
    description: 'You prioritize doing AI right over doing AI fast. Your focus on governance, ethics, and people ensures that when you do scale AI, it\'s sustainable and trustworthy. In an era of increasing AI regulation, this approach is becoming a strategic advantage.',
    strengths: [
      'AI governance framework that satisfies regulators proactively',
      'Organizational readiness through culture and talent investment',
      'Trust-first approach that protects brand reputation',
    ],
    watchOuts: [
      'May be slower to show measurable ROI from AI investments',
      'Risk of over-caution — competitors may establish market position first',
      'Governance overhead can frustrate technical teams who want to move fast',
    ],
    smartforgeFit: 'SmartForge Governance Suite + AI Advisory',
  },
  {
    id: 'value-hunter',
    name: 'The Value Hunter',
    tagline: 'Show me the ROI — then show me more',
    description: 'You\'re laser-focused on business outcomes. Every AI initiative must prove its value, and you\'ve built a portfolio approach to scaling proven wins. The CFO loves your disciplined approach to AI investment, and your track record builds organizational confidence.',
    strengths: [
      'ROI discipline that builds C-suite confidence in AI',
      'Portfolio approach that balances risk and reward',
      'Proven business impact that funds further AI investment',
    ],
    watchOuts: [
      'May under-invest in exploratory or moonshot AI initiatives',
      'Risk of incrementalism — missing transformative opportunities',
      'Data and infrastructure gaps may limit scaling of proven use cases',
    ],
    smartforgeFit: 'SmartForge Discovery Workshop + Strategy Workshop',
  },
];

// Weights for each dimension per archetype
const ARCHETYPE_WEIGHTS: Record<string, Record<string, number>> = {
  'data-architect': {
    'data-foundation': 3,
    'cloud-infrastructure': 3,
    'ai-ml-capabilities': 1,
    'governance-ethics': 1,
    'talent-culture': 1,
    'strategy-leadership': 1,
    'value-realization': 1,
  },
  'innovation-catalyst': {
    'ai-ml-capabilities': 3,
    'strategy-leadership': 3,
    'cloud-infrastructure': 2,
    'data-foundation': 1,
    'governance-ethics': 0,
    'talent-culture': 1,
    'value-realization': 1,
  },
  'responsible-pioneer': {
    'governance-ethics': 3,
    'talent-culture': 3,
    'strategy-leadership': 2,
    'data-foundation': 1,
    'ai-ml-capabilities': 0,
    'cloud-infrastructure': 0,
    'value-realization': 1,
  },
  'value-hunter': {
    'value-realization': 3,
    'strategy-leadership': 3,
    'data-foundation': 1,
    'ai-ml-capabilities': 1,
    'cloud-infrastructure': 0,
    'talent-culture': 1,
    'governance-ethics': 1,
  },
};

export function determineArchetype(answers: Record<string, MaturityLevel>): Archetype {
  let bestScore = -1;
  let bestArchetype = archetypes[0];

  for (const archetype of archetypes) {
    const weights = ARCHETYPE_WEIGHTS[archetype.id];
    let score = 0;
    for (const [dimId, level] of Object.entries(answers)) {
      const weight = weights[dimId] || 0;
      score += level * weight;
    }
    if (score > bestScore) {
      bestScore = score;
      bestArchetype = archetype;
    }
  }

  return bestArchetype;
}
