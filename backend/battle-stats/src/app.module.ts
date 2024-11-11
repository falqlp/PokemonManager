import { Module } from '@nestjs/common';
import { KafkaClientService } from './application/core-interface/kafka-client.service';
import { BattleEventsController } from './api/battle-events/battle-events.controller';
import { BattleEventService } from './application/battle-event/battle-event.service';
import { CoreInterfaceService } from './application/core-interface/core-interface.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DamageEventController } from './api/damage-event/damage-event.controller';
import { BattleParticipationController } from './api/battle-participation/battle-participation.controller';
import DamageEvent from './domain/battleevents/damageevent/DamageEvent';
import BattleParticipationEvent from './domain/battleevents/battleparticipationevent/BattleParticipationEvent';
import DamageEventRepository from './domain/battleevents/damageevent/DamageEventRepository';
import BattleParticipationEventRepository from './domain/battleevents/battleparticipationevent/BattleParticipationEventRepository';
import { mapSchemas } from 'shared/utils';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import ColorService from './application/color/color.service';
import { EmptyPopulater } from 'shared/common';
import BattleEventQueriesUtilService from './domain/battleevents/battle-event-queries-util.service';

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
    MongooseModule.forFeature(
      mapSchemas([DamageEvent, BattleParticipationEvent]),
    ),
  ],
  controllers: [
    BattleEventsController,
    DamageEventController,
    BattleParticipationController,
  ],
  providers: [
    KafkaClientService,
    BattleEventService,
    CoreInterfaceService,
    DamageEventRepository,
    BattleParticipationEventRepository,
    ColorService,
    EmptyPopulater,
    BattleEventQueriesUtilService,
  ],
  exports: [MongooseModule],
})
export class AppModule {}
