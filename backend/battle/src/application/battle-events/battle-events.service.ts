import { Injectable } from '@nestjs/common';
import { IBattleParticipationEvent, IDamageEvent } from 'shared/models';
import {
  KafkaClientService,
  NeedReplyTopics,
} from '../core-interface/kafka-client.service';
import { BattleInstanceBattle } from '../core-interface/core-interface.service';
import { catchError, firstValueFrom, throwError } from 'rxjs';

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

  public ping(): Promise<Date> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.battleStatsPing, {})
        .pipe(
          catchError(() => {
            return throwError(
              () => new Error('Ping error on Battle stats from Battle'),
            );
          }),
        ),
    );
  }
}
