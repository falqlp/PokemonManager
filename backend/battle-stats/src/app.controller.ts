import { Controller } from '@nestjs/common';
import { SharedAppController } from 'shared/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('battle-stats-app')
export class AppController extends SharedAppController {
  @MessagePattern('battle-stats.ping')
  public override ping(): Date {
    return new Date();
  }
}
