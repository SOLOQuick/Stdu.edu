export interface KeyPrinciple {
  name: string;
  rule: string;
  whyItMatters: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  category: 'core' | 'prerequisite' | 'mechanism' | 'application' | string;
  description: string;
}

export interface ConceptEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface SimulationChoice {
  id: string;
  action: string;
  tradeOff: string;
  outcome: string;
}

export interface RealWorldSimulation {
  scenarioTitle: string;
  role: string;
  context: string;
  dilemma: string;
  choices: SimulationChoice[];
}

export interface RetrievalCard {
  id: string;
  question: string;
  answer: string;
  coreInsight: string;
  bloomLevel: 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create' | string;
  userMastery?: 'learning' | 'mastered' | 'review';
}

export interface ModernSkill {
  skillName: string;
  category: string;
  marketRelevance: string;
  portfolioApplication: string;
}

export interface MiniProjectChallenge {
  title: string;
  objective: string;
  deliverable: string;
  steps: string[];
  evaluationChecklist: string[];
}

export interface ActiveLearningMatrix {
  topicTitle: string;
  tagline: string;
  domainCategory: string;
  traditionalPitfall: string;
  mentalModel: string;
  keyPrinciples: KeyPrinciple[];
  conceptGraph: {
    nodes: ConceptNode[];
    edges: ConceptEdge[];
  };
  feynmanProtocol: {
    beginnerQuestion: string;
    coreInsightRequired: string;
    bannedJargon: string[];
  };
  socraticDebate: {
    provocativePremise: string;
    openingQuestion: string;
  };
  realWorldSimulation: RealWorldSimulation;
  retrievalCards: RetrievalCard[];
  modernSkillsUpgraded: ModernSkill[];
  miniProjectChallenge: MiniProjectChallenge;
}

export interface FeynmanEvaluation {
  clarityScore: number;
  level: string;
  jargonDetected: string[];
  conceptualGaps: string[];
  strengths: string[];
  constructiveCritique: string;
  feynmanGoldStandard: string;
}

export interface SocraticMessage {
  id: string;
  role: 'socrates' | 'user';
  content: string;
  timestamp: number;
  rigorRating?: number;
  identifiedAssumption?: string;
  nextParadoxChallenge?: string;
}

export interface StudyMetrics {
  retentionScore: number;
  skillsUnlocked: number;
  cardsMastered: number;
  feynmanScore: number;
  simulationSuccess: boolean;
  streakDays: number;
}
