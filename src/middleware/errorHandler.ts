import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 1. Handle Zod (Runtime) Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        layer: 'runtime',
        // Use .issues instead of .errors for better compatibility
        errors: err.issues.map((e) => ({
          field: e.path.join('.'),
          rule: e.code,
          message: e.message,
          value: req.body && e.path[0] ? req.body[e.path[0]] : 'N/A',
        })),
      },
    });
  }

  // 2. Handle Prisma (Database) Constraint Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: {
          layer: 'database',
          errors: [
            {
              field: (err.meta?.target as string[])?.join('.') || 'unique_field',
              rule: 'unique',
              message: 'Unique constraint failed',
              value: 'conflict',
            },
          ],
        },
      });
    }
  }

  // 3. Handle Application Errors
  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      error: {
        layer: 'application',
        errors: [
          {
            field: 'N/A',
            rule: 'N/A',
            message: err.message,
            value: 'N/A',
          },
        ],
      },
    });
  }

  return res.status(500).json({ success: false, message: 'Internal Server Error' });
};