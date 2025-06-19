import { z } from 'zod';

export const deviceIdSchema = z.object({
  id: z.string().uuid(),
});
