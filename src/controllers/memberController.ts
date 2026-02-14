import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { enrollMemberSchema } from '../schemas/memberSchema';

export const enrollMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = req.params.memberId as string;
    const { gymId, membershipTier } = enrollMemberSchema.parse(req.body);

    const enrollment = await prisma.$transaction(async (tx) => {
      const gym = await tx.gym.findUnique({ where: { id: gymId } });
      const currentCount = await tx.enrollment.count({ where: { gymId } });

      if (!gym) throw new Error('Gym not found');
      if (currentCount >= gym.capacity) throw new Error('Gym is full');

      return tx.enrollment.create({
        data: { memberId, gymId, membershipTier }
      });
    });

    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

export const logHealthMetric = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation for health metrics
};