import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { createGymSchema } from '../schemas/gymSchema';

export const createGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, capacity, address } = createGymSchema.parse(req.body);

    const gym = await prisma.gym.create({
      data: {
        name,
        capacity,
        address,
      },
    });

    res.status(201).json(gym);
  } catch (error) {
    next(error);
  }
};
