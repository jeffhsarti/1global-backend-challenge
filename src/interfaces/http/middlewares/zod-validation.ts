import { AnyZodObject, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

type RequestTarget = 'body' | 'query' | 'params';

export function validate(schema: AnyZodObject, target: RequestTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formatted = result.error.format();
      res.status(400).json({ error: formatted });
      return;
    }

    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }

    next();
  };
}
