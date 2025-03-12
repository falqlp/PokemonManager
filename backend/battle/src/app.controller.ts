import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SharedAppController } from 'shared/common';

@Controller('battle/battle-app')
export class AppController extends SharedAppController {
  @MessagePattern('battle.ping')
  @Get('ping')
  public override ping(): Date {
    return new Date();
  }
}
