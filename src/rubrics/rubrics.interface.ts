export interface RubricsResponse {
  code: number;
  is_success: boolean;
  message: string;
  data: RubricsData;
}

export interface RubricsData {
  assessment: Assessment;
  final_rubric: string;
}

export interface Assessment {
  id: string;
  name: string;
  organization_id: any;
  rubric_id: string;
  scenario_id: any;
  timestamp: string;
  user_id: number;
  material_id: string;
  rubrics: FinalRubric;
  visibility: boolean;
}

export interface AssessmentRaw {
  id: string;
  name: string;
  organization_id: any;
  rubric_id: string;
  scenario_id: any;
  timestamp: string;
  user_id: number;
  material_id: string;
  rubrics: string;
}

export interface FinalRubric {
  rubric_title: string;
  description: string;
  criteria: Criterum[];
  scoring_guide: ScoringGuide;
  performance_levels_summary: PerformanceLevelsSummary;
  note: string;
}

export interface Criterum {
  criterion_name: string;
  weight: number;
  performance_levels: PerformanceLevels;
}

export interface PerformanceLevels {
  Roleplay?: string;
  Image?: string;
  Video?: string;
  Audio?: string;
  Provided?: string;
  'Not Provided'?: string;
  Checklist?: string;
  Qualitative?: string;
  Excellent: string;
  Fair: string;
  'No Attempt': string;
}

export interface ScoringGuide {
  individual_score_description: string;
  weighted_score_description: string;
  total_score_description: string;
}

export interface PerformanceLevelsSummary {
  Roleplay: string;
  Image: string;
  Video: string;
  Audio: string;
  Provided: string;
  'Not Provided': string;
  Checklist: string;
  Qualitative: string;
  Excellent: string;
  Fair: string;
  'No Attempt': string;
}
