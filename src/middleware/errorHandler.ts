import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Custom Error interface to handle status codes safely
 */
interface AppError extends Error {
  statusCode?: number;
}

/**
 * Requirement 5: Standard Error Contract.
 * Ensures all validation failures conform to the mandatory JSON structure.
 */
export const errorHandler = (
  err: unknown, 
  req: Request, 
  res: Response, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // 1. Handle Zod Validation Errors (Application Runtime Layer)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        layer: 'runtime',
        // FIX: Use .issues instead of .errors to fix the TS error
        errors: err.issues.map((e) => ({
          field: e.path.join('.'),
          rule: e.code,
          message: e.message,
          value: (req.body && e.path[0]) ? req.body[e.path[0] as string] : 'unknown',
        })),
      },
    });
  }

  // 2. Handle Prisma Known Request Errors (Database Layer)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      error: {
        layer: 'database',
        errors: [
          {
            field: err.meta?.target ? String(err.meta.target) : 'database',
            rule: err.code,
            message: 'Database constraint violation',
            value: 'N/A',
          },
        ],
      },
    });
  }

  // 3. Handle General Application Errors safely
  const isAppError = err instanceof Error;
  const statusCode = (err as AppError).statusCode || 500;
  const message = isAppError ? err.message : 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};