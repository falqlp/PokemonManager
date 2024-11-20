import { Module } from '@nestjs/common';
import { BattleController } from './api/battle/battle.controller';
import BattleCalcService from './application/battle/BattleCalcService';
import { BattleDataService } from './application/battle/BattleDataService';
import BattleService from './application/battle/BattleService';
import BattleSideEffectService from './application/battle/BattleSideEffectService';
import { BattleEventsService } from './application/battle-events/battle-events.service';
import { CoreInterfaceService } from './application/core-interface/core-interface.service';
import { KafkaClientService } from './application/core-interface/kafka-client.service';
import BattleWebsocketService from './application/websocket/battle-websocket.service';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, '..', '.env'), '../.env'],
      isGlobal: true,
    }),
  ],
  controllers: [BattleController],
  providers: [
    BattleCalcService,
    BattleDataService,
    BattleService,
    BattleSideEffectService,
    BattleEventsService,
    CoreInterfaceService,
    KafkaClientService,
    BattleWebsocketService,
  ],
})
export class AppModule {}
