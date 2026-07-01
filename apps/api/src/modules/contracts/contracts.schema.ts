import { z } from 'zod';

export const contractIdParamsSchema = z.object({
  id: z.string().uuid(),
});
