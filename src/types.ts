export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface PhilosophyStage {
  id: 'understand' | 'think' | 'act';
  title: string;
  subtitle: string;
  description: string;
  visualTag: string;
  details: string[];
}

export interface AudienceWorld {
  id: 'people' | 'professionals' | 'businesses';
  tagline: string;
  title: string;
  description: string;
  badge: string;
  features: string[];
  sampleScenario: {
    input: string;
    processing: string;
    action: string;
  };
}

export interface EcosystemPillar {
  id: string;
  title: string;
  summary: string;
  focus: string;
  keyInnovations: string[];
  status: 'Active Research' | 'Architectural Prototyping' | 'Core Exploration' | 'Long-range R&D';
}

export interface TimelineMilestone {
  stage: 'NOW' | 'DISCOVER' | 'BUILD' | 'EVOLVE' | 'THE FUTURE';
  title: string;
  timeframe: string;
  description: string;
  focus: string[];
  status: 'current' | 'upcoming' | 'vision';
}

export interface TeamPillar {
  role: string;
  discipline: string;
  quote: string;
  status: string;
}
