import { z } from 'zod';

export const contractTypeSchema = z.enum([
  'NDA',
  'Employment',
  'Service Agreement',
  'Lease',
  'Other',
]);

export const contractAIResultSchema = z.object({
  type: contractTypeSchema,
  riskScore: z.number().min(0).max(100),
  missingClauses: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export const contractAnalysisSchema = contractAIResultSchema.extend({
  id: z.string(),
  filename: z.string(),
  createdAt: z.string(),
});
