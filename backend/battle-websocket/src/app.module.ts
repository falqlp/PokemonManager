import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BattleWebsocketGateway } from './application/battle-websocket/battle-websocket.gateway';
import { BattleWebsocketController } from './api/battle-websocket/battle-websocket.controller';

@Module({
  imports: [],
  controllers: [AppController, BattleWebsocketController],
  providers: [AppService, BattleWebsocketGateway],
})
export class AppModule {}
