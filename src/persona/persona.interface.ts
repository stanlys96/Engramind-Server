export interface PersonaData {
  id: string;
  name: string;
  organization_id: any;
  persona_details: PersonaDetails;
  timestamp: string;
  user_id: number;
}

export interface PersonaDetails {
  'Big 5 Personality': string;
  age: string;
  background: string;
  birthdate: string;
  challengesAndGrowthAreas: string;
  gender: string;
  hometown: string;
  industryRelevance: string;
  language: string;
  motivationsAndGoals: string;
  name: string;
  nationality: string;
  occupation: string;
  personalityTraits: PersonalityTraits;
  physicalDescription: PhysicalDescription;
  relevanceToScenario: string;
  scenarioSnippet: string;
  skillsAndAbilities: string;
  visualDescription: string;
}

export interface PersonalityTraits {
  bigFive: BigFive;
  enneagramType: string;
  mbtiType: string;
}

export interface BigFive {
  agreeableness: string;
  conscientiousness: string;
  extraversion: string;
  neuroticism: string;
  openness: string;
}

export interface PhysicalDescription {
  build: string;
  distinguishingFeatures: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  height: string;
  skinTone: string;
  typicalAttire: string;
}
