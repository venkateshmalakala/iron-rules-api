import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

type TrainerWithAssignments = Prisma.TrainerGetPayload<{
  include: { assignments: true }
}>;

export const assignTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainerId = req.params.trainerId as string;
    const { gymId } = req.body;

    if (typeof gymId !== 'string') {
      const error = new Error('Gym ID must be a string');
      (error as any).statusCode = 400;
      throw error;
    }

    const assignment = await prisma.$transaction(async (tx) => {
      const trainer = await tx.trainer.findUnique({
        where: { id: trainerId },
        include: { assignments: true },
      }) as TrainerWithAssignments | null;

      if (!trainer) {
        const error = new Error('Trainer not found');
        (error as any).statusCode = 404;
        throw error;
      }

      if (new Date(trainer.expiryDate) < new Date()) {
        const error = new Error('Trainer certification has expired');
        (error as any).statusCode = 400;
        throw error;
      }

      const currentCount = trainer.assignments.length;
      const limit = trainer.certification.toLowerCase() === 'advanced' ? 3 : 1;

      if (currentCount >= limit) {
        const error = new Error(`Trainer limit reached (${limit} max)`);
        (error as any).statusCode = 400;
        throw error;
      }

      return tx.trainerAssignment.create({
        data: { trainerId, gymId },
      });
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};