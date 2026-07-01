import type { z } from 'zod';
import type {
  contractAIResultSchema,
  contractAnalysisSchema,
  contractTypeSchema,
  riskSeveritySchema,
  riskyClauseSchema,
} from './validation';

export type ContractType = z.infer<typeof contractTypeSchema>;
export type RiskSeverity = z.infer<typeof riskSeveritySchema>;
export type RiskyClause = z.infer<typeof riskyClauseSchema>;
export type ContractAIResult = z.infer<typeof contractAIResultSchema>;
export type ContractAnalysis = z.infer<typeof contractAnalysisSchema>;

// Standard API response envelopes.
export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
