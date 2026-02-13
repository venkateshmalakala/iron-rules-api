import { z } from 'zod';

export const createHealthMetricSchema = z.object({
  type: z.enum(['heart_rate', 'weight']),
  value: z.number(),
});

export type CreateHealthMetricInput = z.infer<typeof createHealthMetricSchema>;
