import { contractAIResultSchema, type ContractAIResult } from '@app/types';

// TODO: call the AI (Vercel AI SDK `generateObject` + `openai`), validating the
// response against contractAIResultSchema. Handle API errors gracefully.
export { contractAIResultSchema };

export async function analyseText(_text: string): Promise<ContractAIResult> {
  throw new Error('AI service not implemented yet');
}
