import { Assessment } from './rubrics.interface';

export function extractAndParseRubricJSON(input: string): Assessment | null {
  const jsonRegex = /```json\s*({[\s\S]*?})\s*```/;
  const match = input.match(jsonRegex);

  if (match && match[1]) {
    try {
      const json = JSON.parse(match[1]);
      return json;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return null;
    }
  } else {
    console.warn('No valid JSON block found in the input.');
    return null;
  }
}
