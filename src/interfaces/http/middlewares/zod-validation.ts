import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: AnyZodObject, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[part]);
      next();
      return;
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.errors });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
}
