import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().min(3),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const enrollMemberSchema = z.object({
  gymId: z.string(),
  membershipTier: z.string(),
});

export type EnrollMemberInput = z.infer<typeof enrollMemberSchema>;
