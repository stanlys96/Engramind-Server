export interface CreateQuickRoleplayDTO {
  scenario_title: string;
  ai_role: string;
  my_role: string;
  scenario_description: string;
  organization_id: string;
  file_ids?: string[];
}
