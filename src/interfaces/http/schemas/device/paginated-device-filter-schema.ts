import { DEVICE_STATE } from '@domain/enums/device-state';
import { z } from 'zod';

export const paginatedDeviceFilterSchema = z
  .object({
    brand: z.string().optional(),
    state: z.nativeEnum(DEVICE_STATE).optional(),
  })
  .refine((data) => data.brand || data.state, {
    message: 'At least one of "brand" or "state" must be provided',
  });
