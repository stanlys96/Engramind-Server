export interface GlossaryResponse {
  code: number;
  is_success: boolean;
  message: string;
  data: GlossaryData;
}

export interface GlossaryData {
  glossary: string;
  id: string;
  name: string;
  organization_id: any;
  timestamp: string;
  user_id: number;
}
