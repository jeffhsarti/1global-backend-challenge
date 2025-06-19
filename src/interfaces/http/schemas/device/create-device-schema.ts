import { z } from 'zod';

export const createDeviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
});

export type CreateDeviceDTO = z.infer<typeof createDeviceSchema>;
