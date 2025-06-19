import { z } from 'zod';
import { DEVICE_STATE } from '@domain/enums/device-state';

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const updateInfoSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
});

export const updateStateSchema = z.object({
  state: z.nativeEnum(DEVICE_STATE),
});
