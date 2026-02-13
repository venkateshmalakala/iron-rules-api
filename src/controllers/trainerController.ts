import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const assignTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // FIX: Cast trainerId as string
    const trainerId = req.params.trainerId as string;
    const { gymId } = req.body;

    // FIX: Include _count in the query to satisfy Requirement 7
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      include: { 
        _count: { select: { assignments: true } } 
      }
    });

    if (!trainer) return res.status(404).json({ success: false, message: "Trainer not found" });

    // Check Certification Expiry
    if (new Date(trainer.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Certification expired" });
    }

    // Check Limits (Requirement 7)
    const limit = trainer.certification === 'advanced' ? 3 : 1;
    if (trainer._count.assignments >= limit) {
      return res.status(400).json({ success: false, message: "Assignment limit reached" });
    }

    const assignment = await prisma.trainerAssignment.create({
      data: { 
        trainerId, 
        gymId: gymId as string // Cast gymId as string
      }
    });

    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};