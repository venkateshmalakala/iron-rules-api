import { z } from 'zod';

const strengthExerciseSchema = z.object({
  type: z.literal('strength'),
  data: z.object({
    reps: z.number().int().positive(),
    sets: z.number().int().positive(),
    weight: z.number().positive(),
  }),
});

const cardioExerciseSchema = z.object({
  type: z.literal('cardio'),
  data: z.object({
    duration: z.number().int().positive(),
    distance: z.number().positive(),
  }),
});

export const createWorkoutSchema = z.discriminatedUnion('type', [
  strengthExerciseSchema,
  cardioExerciseSchema,
]);

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
