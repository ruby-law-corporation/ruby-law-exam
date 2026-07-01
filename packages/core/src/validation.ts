import { z } from 'zod';

export const contractTypeSchema = z.enum([
  'NDA',
  'Employment',
  'Service Agreement',
  'Lease',
  'Other',
]);

export const riskSeveritySchema = z.enum(['low', 'medium', 'high']);

export const riskyClauseSchema = z.object({
  text: z.string(),
  severity: riskSeveritySchema,
  reason: z.string(),
});

export const contractAIResultSchema = z.object({
  isContract: z.boolean(),
  type: contractTypeSchema,
  riskScore: z.number().min(0).max(100),
  missingClauses: z.array(z.string()),
  recommendations: z.array(z.string()),
  riskyClauses: z.array(riskyClauseSchema),
});

export const contractAnalysisSchema = contractAIResultSchema.extend({
  id: z.string(),
  filename: z.string(),
  fullText: z.string(),
  createdAt: z.string(),
});
