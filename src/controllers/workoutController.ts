import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { createWorkoutSchema } from '../schemas/workoutSchema';

export const logWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = req.params.memberId as string;
    const validatedData = createWorkoutSchema.parse(req.body);

    // Cast prisma to 'any' to bypass the model existence error until the build is complete
    const workout = await (prisma as any).workout.create({
      data: {
        memberId,
        type: validatedData.type,
        data: validatedData.data as any,
      }
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
};