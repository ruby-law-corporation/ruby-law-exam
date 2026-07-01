import type { z } from 'zod';
import type {
  contractProgressEventSchema,
  contractProgressStageSchema,
} from './progress';
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
export type ContractProgressStage = z.infer<typeof contractProgressStageSchema>;
export type ContractProgressEvent = z.infer<typeof contractProgressEventSchema>;

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
