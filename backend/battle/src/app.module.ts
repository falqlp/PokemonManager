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
import { mapSchemas } from 'shared/utils';
import BattleState from './domain/BattleState';
import { MongooseModule } from '@nestjs/mongoose';
import BattleStateRepository from './domain/BattleStateRepository';
import { EmptyPopulater } from 'shared/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, '..', '.env'), '../.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.MONGODB_LOCAL !== '0'
            ? 'mongodb://127.0.0.1:27017/PokemonManager'
            : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.1eldau8.mongodb.net/PokemonManager`,
      }),
    }),
    MongooseModule.forFeature(mapSchemas([BattleState])),
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
    BattleStateRepository,
    EmptyPopulater,
  ],
})
export class AppModule {}
