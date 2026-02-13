import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { enrollMemberSchema } from '../schemas/memberSchema';
import { createHealthMetricSchema } from '../schemas/healthMetricSchema';

// --- ENROLLMENT LOGIC ---
export const enrollMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Cast to string to satisfy Prisma's strict requirements for IDs
    const memberId = req.params.memberId as string; 
    const { gymId, membershipTier } = enrollMemberSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const gym = await tx.gym.findUnique({
        where: { id: gymId },
        include: { _count: { select: { members: true } } },
      });

      if (!gym) throw new Error('Gym not found');
      
      // Iron Rule: Capacity Check (Requirement 8)
      if (gym._count.members >= gym.capacity) {
        throw new Error('Gym is at full capacity');
      }

      return await tx.enrollment.create({
        data: {
          memberId,
          gymId,
          membershipTier,
        },
      });
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// --- HEALTH METRIC LOGIC ---
export const logHealthMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberId = req.params.memberId as string;
    const { type, value } = createHealthMetricSchema.parse(req.body);

    // Iron Rule: Physiological bounds (Requirement 4/6)
    if (type === 'heart_rate' && (value < 30 || value > 220)) {
      throw new Error('Heart rate must be between 30 and 220');
    }

    if (type === 'weight') {
      // Iron Rule: Temporal Weight Limit (Requirement 10)
      const lastMetric = await prisma.healthMetric.findFirst({
        where: {
          memberId,
          type: 'weight',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (lastMetric && Math.abs(value - lastMetric.value) > 5) {
        throw new Error('Weight change cannot be more than 5kg in 24 hours');
      }
    }

    const healthMetric = await prisma.healthMetric.create({
      data: {
        memberId,
        type,
        value,
      },
    });

    res.status(201).json(healthMetric);
  } catch (error) {
    next(error);
  }
};