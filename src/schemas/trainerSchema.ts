import { z } from 'zod';

export const createTrainerSchema = z.object({
  name: z.string().min(3),
  certification: z.enum(['basic', 'advanced']),
  expiryDate: z.string().datetime(),
});

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;

export const assignTrainerSchema = z.object({
  gymId: z.string(),
});

export type AssignTrainerInput = z.infer<typeof assignTrainerSchema>;
