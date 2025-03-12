import { Get } from '@nestjs/common';

export abstract class SharedAppController {
  @Get('ping')
  public ping(): Date {
    return new Date();
  }
}
