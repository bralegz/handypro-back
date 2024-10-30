// raw-body.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

// Extend the Request interface to include rawBody
declare module 'express-serve-static-core' {
  interface Request {
    rawBody: string;
  }
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    req.rawBody = '';

    req.on('data', (chunk) => {
      req.rawBody += chunk;
    });

    req.on('end', () => {
      next();
    });
  }
}
