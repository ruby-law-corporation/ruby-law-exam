import { z } from 'zod';

export const contractProgressStageSchema = z.enum([
  'uploading',
  'extracting',
  'analysing',
  'done',
  'error',
]);

export const contractProgressEventSchema = z.object({
  stage: contractProgressStageSchema,
  message: z.string().optional(),
});

export function isContractProgressComplete(event: {
  stage: z.infer<typeof contractProgressStageSchema>;
}): boolean {
  return event.stage === 'done' || event.stage === 'error';
}
