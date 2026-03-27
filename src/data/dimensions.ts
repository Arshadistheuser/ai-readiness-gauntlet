import { Dimension } from '@/types/assessment';

export const dimensions: Dimension[] = [
  {
    id: 'data-foundation',
    name: 'Data Foundation',
    shortName: 'Data',
    scenario: 'Your CEO wants to launch AI-powered demand forecasting. When your data team audits the required data sources, they discover...',
    options: [
      {
        level: 1,
        label: 'Fragmented & Manual',
        description: 'Critical data lives in disconnected spreadsheets, departmental databases, and legacy systems with no documentation. A comprehensive data audit would take months.',
      },
      {
        level: 2,
        label: 'Centralized but Lagging',
        description: 'A central data warehouse exists but updates weekly at best. Teams still maintain shadow copies, and data quality is checked manually before major reports.',
      },
      {
        level: 3,
        label: 'Integrated & Monitored',
        description: 'An enterprise data platform with automated ETL pipelines, a data catalog, and real-time quality monitoring. Most business data is accessible via governed APIs.',
      },
      {
        level: 4,
        label: 'Intelligent & Self-Healing',
        description: 'A modern data mesh with domain-owned data products, ML feature stores, real-time streaming, and AI-augmented data quality that auto-detects and resolves anomalies.',
      },
    ],
    benchmarks: {
      'technology': 3.2, 'financial-services': 2.8, 'healthcare': 2.1,
      'manufacturing': 2.0, 'retail': 2.4, 'energy': 1.9,
      'professional-services': 2.3, 'other': 2.1,
    },
  },
  {
    id: 'ai-ml-capabilities',
    name: 'AI & ML Capabilities',
    shortName: 'AI/ML',
    scenario: 'A competitor just launched an AI-powered product that\'s capturing market share. When you assess your team\'s ability to respond, you find...',
    options: [
      {
        level: 1,
        label: 'No AI in Play',
        description: 'Your team relies on traditional BI dashboards and Excel models. "AI" means a few people experimenting with ChatGPT on their own time.',
      },
      {
        level: 2,
        label: 'Early Experiments',
        description: 'You have 1\u20132 data scientists running pilot projects. One ML model lives in a Jupyter notebook somewhere, but nothing is in production yet.',
      },
      {
        level: 3,
        label: 'Production ML Pipeline',
        description: 'A dedicated ML engineering team manages 5+ models in production with an MLOps pipeline. You have model monitoring, versioning, and automated retraining.',
      },
      {
        level: 4,
        label: 'AI-First Development',
        description: 'AI is embedded across product development. AutoML pipelines, continuous A/B testing of models, and your ML platform serves hundreds of models at scale.',
      },
    ],
    benchmarks: {
      'technology': 3.3, 'financial-services': 2.5, 'healthcare': 2.0,
      'manufacturing': 1.8, 'retail': 2.1, 'energy': 1.7,
      'professional-services': 2.0, 'other': 1.9,
    },
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud & Infrastructure',
    shortName: 'Cloud',
    scenario: 'Your CTO proposes deploying a real-time recommendation engine. When you evaluate infrastructure readiness, the assessment reveals...',
    options: [
      {
        level: 1,
        label: 'Legacy On-Premise',
        description: 'Core systems run on-premise with manual provisioning. Deploying anything new requires a multi-month procurement cycle and hardware setup.',
      },
      {
        level: 2,
        label: 'Hybrid & Migrating',
        description: 'You\'re hybrid\u2014some workloads are in the cloud, but critical systems remain on-premise. Your team is still learning cloud-native patterns and tooling.',
      },
      {
        level: 3,
        label: 'Cloud-Native by Default',
        description: 'New workloads are cloud-native by default. You use containerization, CI/CD pipelines, and infrastructure-as-code. Legacy migration is well underway.',
      },
      {
        level: 4,
        label: 'Multi-Cloud & Edge',
        description: 'Multi-cloud architecture with serverless computing, auto-scaling, and edge deployment. Your platform team provides self-service infrastructure to all teams.',
      },
    ],
    benchmarks: {
      'technology': 3.4, 'financial-services': 2.9, 'healthcare': 2.2,
      'manufacturing': 2.1, 'retail': 2.5, 'energy': 2.0,
      'professional-services': 2.6, 'other': 2.2,
    },
  },
  {
    id: 'governance-ethics',
    name: 'Governance & Ethics',
    shortName: 'Governance',
    scenario: 'A regulator requests documentation of how your AI systems make decisions. Your response team...',
    options: [
      {
        level: 1,
        label: 'No Framework',
        description: 'Scrambles to identify which systems even use AI. There\'s no inventory of AI models, and "governance" hasn\'t been discussed beyond basic data privacy.',
      },
      {
        level: 2,
        label: 'Privacy-Aware',
        description: 'Has basic data privacy policies (GDPR/CCPA compliance) but no AI-specific governance. Model documentation exists but is inconsistent and outdated.',
      },
      {
        level: 3,
        label: 'Structured Oversight',
        description: 'Presents a model registry with audit trails, bias detection reports, and an AI ethics review process. An AI governance board meets quarterly to review deployments.',
      },
      {
        level: 4,
        label: 'Automated Compliance',
        description: 'Delivers comprehensive governance documentation including model cards, fairness metrics, explainability reports, and continuous compliance monitoring\u2014all automated.',
      },
    ],
    benchmarks: {
      'technology': 2.8, 'financial-services': 3.0, 'healthcare': 2.4,
      'manufacturing': 1.8, 'retail': 2.0, 'energy': 2.1,
      'professional-services': 2.2, 'other': 1.9,
    },
  },
  {
    id: 'talent-culture',
    name: 'Talent & Culture',
    shortName: 'Talent',
    scenario: 'You need to staff a cross-functional AI initiative spanning three business units. Looking at your talent landscape...',
    options: [
      {
        level: 1,
        label: 'No AI Talent',
        description: 'You have no dedicated AI/ML roles. Your IT team is stretched thin maintaining existing systems, and "AI" isn\'t in any job descriptions.',
      },
      {
        level: 2,
        label: 'Small Centralized Team',
        description: 'You\'ve hired a small data team (3\u20135 people) but they\'re centralized in IT. Business units see AI as "someone else\'s job." Training programs are just starting.',
      },
      {
        level: 3,
        label: 'Center of Excellence',
        description: 'A Center of Excellence supports business units with data translators. AI literacy programs have trained 200+ employees. Cross-functional AI projects are common.',
      },
      {
        level: 4,
        label: 'AI-Native Organization',
        description: 'AI fluency is a core competency across the org. Citizen data scientists in every department. Innovation labs run regular hackathons. Top AI talent seeks you out.',
      },
    ],
    benchmarks: {
      'technology': 3.2, 'financial-services': 2.6, 'healthcare': 2.1,
      'manufacturing': 1.9, 'retail': 2.2, 'energy': 1.8,
      'professional-services': 2.4, 'other': 2.0,
    },
  },
  {
    id: 'strategy-leadership',
    name: 'Strategy & Leadership',
    shortName: 'Strategy',
    scenario: 'At the annual strategy offsite, when AI comes up on the agenda...',
    options: [
      {
        level: 1,
        label: 'Curiosity Stage',
        description: 'It\'s a 10-minute "innovation update" at the end of the day. No budget, no owner, and the discussion stays at "we should probably explore this."',
      },
      {
        level: 2,
        label: 'Pilot Budget Allocated',
        description: 'There\'s a dedicated AI section with a pilot budget. Leadership is supportive but AI competes with other priorities. No clear executive sponsor owns the AI agenda.',
      },
      {
        level: 3,
        label: 'Roadmap with KPIs',
        description: 'AI has its own strategic track with dedicated budget tied to business KPIs. The CDO/CTO owns the AI roadmap, and quarterly reviews track progress against outcomes.',
      },
      {
        level: 4,
        label: 'Board-Level Mandate',
        description: 'AI is the opening keynote topic. The board has mandated AI-first transformation. Every business unit has AI targets in their P&L. AI is explicit competitive strategy.',
      },
    ],
    benchmarks: {
      'technology': 3.0, 'financial-services': 2.7, 'healthcare': 2.3,
      'manufacturing': 2.1, 'retail': 2.3, 'energy': 1.9,
      'professional-services': 2.5, 'other': 2.1,
    },
  },
  {
    id: 'value-realization',
    name: 'Use Cases & Value',
    shortName: 'Value',
    scenario: 'When your CFO asks for the ROI on AI investments made in the past 18 months...',
    options: [
      {
        level: 1,
        label: 'Nothing to Report',
        description: 'There\'s nothing to show\u2014no AI projects have been funded or deployed. The "AI investment" has been conference attendance and a few tool subscriptions.',
      },
      {
        level: 2,
        label: 'Promising Pilots',
        description: 'You showcase 1\u20132 pilots that show promise but haven\'t scaled. ROI is projected, not proven. The CFO asks when these will move beyond "experimentation."',
      },
      {
        level: 3,
        label: 'Proven Portfolio',
        description: 'You present 5+ production use cases with measured business impact: cost savings, efficiency gains, or revenue contribution. A portfolio approach prioritizes scaling wins.',
      },
      {
        level: 4,
        label: 'AI as Revenue Driver',
        description: 'AI is a line item in revenue. Multiple AI-powered products generate measurable income. The CFO\'s report includes an "AI contribution" section showing 15%+ efficiency gains.',
      },
    ],
    benchmarks: {
      'technology': 2.9, 'financial-services': 2.6, 'healthcare': 1.9,
      'manufacturing': 1.8, 'retail': 2.2, 'energy': 1.6,
      'professional-services': 2.1, 'other': 1.8,
    },
  },
];

export const industries = [
  { id: 'technology', label: 'Technology & Software' },
  { id: 'financial-services', label: 'Financial Services & Banking' },
  { id: 'healthcare', label: 'Healthcare & Life Sciences' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'retail', label: 'Retail & Consumer' },
  { id: 'energy', label: 'Energy & Utilities' },
  { id: 'professional-services', label: 'Professional Services' },
  { id: 'other', label: 'Other' },
];

export const roles = [
  'CIO / Chief Information Officer',
  'CTO / Chief Technology Officer',
  'CDO / Chief Data Officer',
  'CFO / Chief Financial Officer',
  'VP of Engineering',
  'VP of Data & Analytics',
  'Director of IT',
  'Other Executive',
];

export const companySizes = [
  { id: 'smb' as const, label: 'SMB', description: 'Under 500 employees' },
  { id: 'mid-market' as const, label: 'Mid-Market', description: '500 \u2013 5,000 employees' },
  { id: 'enterprise' as const, label: 'Enterprise', description: '5,000+ employees' },
];
