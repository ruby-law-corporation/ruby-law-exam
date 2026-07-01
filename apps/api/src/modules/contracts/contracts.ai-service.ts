import { createOpenAI } from '@ai-sdk/openai';
import { contractAIResultSchema, type ContractAIResult } from '@app/core';
import { generateObject } from 'ai';
import { env } from '../../config/env';
import { ApiError } from '../../platform/http/api-error';

export { contractAIResultSchema };

const SYSTEM_PROMPT = `You are a senior contract analyst for a legal-tech platform.
Classify the contract and assess its risk. Respond only with the structured fields requested.

- type: the contract category. Use "Other" if none of the listed types fit.
- riskScore: an integer from 0 (no concerns) to 100 (severe legal exposure).
- missingClauses: standard clauses a contract of this type should contain but does not.
- recommendations: concise, plain-English actions to reduce risk.

Base every judgement only on the contract text provided.`;

export async function analyseText(text: string): Promise<ContractAIResult> {
  if (!env.OPENAI_API_KEY) {
    throw new ApiError(
      503,
      'AI_NOT_CONFIGURED',
      'AI analysis is unavailable: OPENAI_API_KEY is not set',
    );
  }

  const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });

  const { object } = await generateObject({
    model: openai(env.OPENAI_MODEL),
    schema: contractAIResultSchema,
    system: SYSTEM_PROMPT,
    prompt: text,
  }).catch(() => {
    throw new ApiError(
      502,
      'AI_REQUEST_FAILED',
      'The AI analysis service is currently unavailable',
    );
  });

  return object;
}
