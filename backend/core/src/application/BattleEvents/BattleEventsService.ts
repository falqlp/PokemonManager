import { Injectable } from '@nestjs/common';
import { IBattleInstance } from '../../domain/battleInstance/Battle';
import { CoreKafkaClientService } from '../core-kafka-client/core-kafka-client.service';
import { IBattleParticipationEvent, IDamageEvent } from 'shared/models';

@Injectable()
export class BattleEventsService {
  constructor(private readonly coreClient: CoreKafkaClientService) {}

  public insertBattleEventsData(
    damageEvents: IDamageEvent[],
    battleParticipationEvents: IBattleParticipationEvent[],
    battle: IBattleInstance,
    date: Date,
  ): void {
    this.coreClient.getClient().emit('battle-events.insert', {
      damageEvents,
      battleParticipationEvents,
      battle,
      date,
    });
  }

  public deleteDamageEventsForGame(gameId: string): void {
    this.coreClient
      .getClient()
      .emit('damage-event.delete-all-for-game', gameId);
  }

  public deleteAllBattleParticipationsForGame(gameId: string): void {
    this.coreClient
      .getClient()
      .emit('battle-participation.delete-all-for-game', gameId);
  }
}
