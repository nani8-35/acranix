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

export type UserRole = 'USER' | 'ADMIN';

export interface UserPreferences {
  autoBriefing: boolean;
  entropyAlerts: boolean;
  soundFeedback: boolean;
  compactDashboard: boolean;
  emailDigest: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  roleTitle?: string;
  organization?: string;
  bio?: string;
  timezone?: string;
  primaryDiscipline?: string;
  avatarColor?: string;
  joinedAt?: string;
  dailyGoal?: string;
  preferences?: UserPreferences;
}

export interface DailyActionItem {
  id: string;
  userId: string;
  title: string;
  category: 'Understand' | 'Think' | 'Act' | 'Operations';
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  dueDate: string;
  createdAt: string;
  impactNotes?: string;
}

