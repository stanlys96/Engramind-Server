export interface CreatePersonaDTO {
  name: string;
  persona_prompt: string;
  organization_id?: string;
  file_ids?: string[];
}

export interface UpdatePersonaDTO {
  id: string;
  name: string;
  persona_name: string;
  age: string;
  gender: string;
  occupation: string;
  language: string;
  hometown: string;
  birthdate: string;
  nationality: string;
  background: string;
  scenarioSnippet: string;
  mbtiType: string;
  enneagramType: string;
  openness: string;
  conscientiousness: string;
  extraversion: string;
  agreeableness: string;
  neuroticism: string;
  skillsAndAbilities: string;
  motivationsAndGoals: string;
  build: string;
  height: string;
  eyeColor: string;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  typicalAttire: string;
  distinguishingFeatures: string;
  industryRelevance: string;
  relevanceToScenario: string;
  challengesAndGrowthAreas: string;
}
