import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      req.rawBody += chunk;
    });

    req.on('end', () => {
      next();
    });
  }
}
