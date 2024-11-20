import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { HandleWebsocketMessageService } from './HandleWebsocketMessageService';
import WebsocketUtils from './WebsocketUtils';
import SimulateDayWebsocketService from './SimulateDayWebsocketService';
import BattleWebsocketService from './BattleWebsocketService';
import { DomainModule } from '../domain/domain.module';
import { WebsocketUtilsModule } from './websocket-utils.module';

@Module({
  controllers: [BattleWebsocketService],
  imports: [DomainModule, WebsocketUtilsModule],
  providers: [
    WebsocketGateway,
    HandleWebsocketMessageService,
    WebsocketUtils,
    SimulateDayWebsocketService,
  ],
  exports: [SimulateDayWebsocketService, WebsocketUtils, WebsocketUtilsModule],
})
export class WebsocketModule {}
