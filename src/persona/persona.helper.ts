import { UpdatePersonaDTO } from './persona.dto';

export const handleUpdatePersonaDTO = (values: UpdatePersonaDTO) => {
  return {
    name: values.name,
    persona_details: {
      name: values.persona_name,
      age: values.age,
      gender: values.gender,
      occupation: values.occupation,
      language: values.language,
      hometown: values.hometown,
      birthdate: values.birthdate,
      nationality: values.nationality,
      background: values.background,
      scenarioSnippet: values.scenarioSnippet,
      personalityTraits: {
        mbtiType: values.mbtiType,
        enneagramType: values.enneagramType,
        bigFive: {
          openness: values.openness,
          conscientiousness: values.conscientiousness,
          extraversion: values.extraversion,
          agreeableness: values.agreeableness,
          neuroticism: values.neuroticism,
        },
      },
      physicalDescription: {
        build: values.build,
        height: values.height,
        eyeColor: values.eyeColor,
        skinTone: values.skinTone,
        hairColor: values.hairColor,
        hairStyle: values.hairStyle,
        typicalAttire: values.typicalAttire,
        distinguishingFeatures: values.distinguishingFeatures,
      },
      skillsAndAbilities: values.skillsAndAbilities,
      motivationsAndGoals: values.motivationsAndGoals,
      industryRelevance: values.industryRelevance,
      relevanceToScenario: values.relevanceToScenario,
      challengesAndGrowthAreas: values.challengesAndGrowthAreas,
    },
  };
};
