import { Injectable } from '@nestjs/common';
import { IBattleParticipationEvent, IDamageEvent } from 'shared/models';
import { KafkaClientService } from '../core-interface/kafka-client.service';
import { BattleInstanceBattle } from '../core-interface/core-interface.service';

@Injectable()
export class BattleEventsService {
  constructor(private readonly kafkaClientService: KafkaClientService) {}

  public insertBattleEventsData(
    damageEvents: IDamageEvent[],
    battleParticipationEvents: IBattleParticipationEvent[],
    battle: BattleInstanceBattle,
    date: Date,
  ): void {
    this.kafkaClientService.getClient().emit('battle-events.insert', {
      damageEvents,
      battleParticipationEvents,
      battle,
      date,
    });
  }
}
