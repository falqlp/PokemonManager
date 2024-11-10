import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class DateConverterMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    next();
  }
}
