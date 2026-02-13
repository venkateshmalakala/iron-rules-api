import { z } from 'zod';

export const createGymSchema = z.object({
  name: z.string().min(3),
  capacity: z.number().int().positive(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
  }),
});

export type CreateGymInput = z.infer<typeof createGymSchema>;
