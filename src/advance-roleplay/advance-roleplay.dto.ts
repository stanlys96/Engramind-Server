export interface CreateAdvanceRoleplayDTO {
  scenario_title: string;
  persona_id: string;
  rubric_id: string;
  scenario_description: string;
  organization_id?: string;
  file_ids?: string[];
}
