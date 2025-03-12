import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('battle-websocket-app')
export class AppController {
  @MessagePattern('battle-websocket.ping')
  public ping(): Date {
    return new Date();
  }
}
