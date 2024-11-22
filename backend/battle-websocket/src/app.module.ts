import { Module } from '@nestjs/common';
import { BattleWebsocketGateway } from './application/battle-websocket/battle-websocket.gateway';
import { BattleWebsocketController } from './api/battle-websocket/battle-websocket.controller';

@Module({
  imports: [],
  controllers: [BattleWebsocketController],
  providers: [BattleWebsocketGateway],
})
export class AppModule {}
