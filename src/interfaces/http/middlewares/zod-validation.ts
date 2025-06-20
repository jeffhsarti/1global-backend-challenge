import { AnyZodObject } from 'zod';
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
