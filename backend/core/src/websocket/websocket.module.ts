import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import WebsocketDataService from './WebsocketDataService';
import { HandleWebsocketMessageService } from './HandleWebsocketMessageService';
import WebsocketUtils from './WebsocketUtils';
import SimulateDayWebsocketService from './SimulateDayWebsocketService';
import BattleWebsocketService from './BattleWebsocketService';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [DomainModule],
  providers: [
    WebsocketGateway,
    WebsocketDataService,
    HandleWebsocketMessageService,
    WebsocketUtils,
    SimulateDayWebsocketService,
    BattleWebsocketService,
  ],
  exports: [
    WebsocketDataService,
    BattleWebsocketService,
    SimulateDayWebsocketService,
    WebsocketUtils,
  ],
})
export class WebsocketModule {}
