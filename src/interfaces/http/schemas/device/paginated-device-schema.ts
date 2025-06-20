import { SORT_ORDER } from '@config/enums/sort-order';
import { z } from 'zod';

export const paginatedDeviceSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be a positive integer'),
  count: z.coerce.number().int().min(1, 'Count must be a positive integer'),
  sortBy: z.union([z.literal('brand'), z.literal('name')]).optional(),
  sortOrder: z.nativeEnum(SORT_ORDER).optional(),
});
