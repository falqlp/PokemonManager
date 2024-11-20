import { Injectable } from '@nestjs/common';
import { CoreKafkaClientService } from '../core-kafka-client/core-kafka-client.service';

@Injectable()
export class BattleEventsService {
  constructor(
    private readonly coreKafkaClientService: CoreKafkaClientService,
  ) {}

  public deleteDamageEventsForGame(gameId: string): void {
    this.coreKafkaClientService
      .getClient()
      .emit('damage-event.delete-all-for-game', gameId);
  }

  public deleteAllBattleParticipationsForGame(gameId: string): void {
    this.coreKafkaClientService
      .getClient()
      .emit('battle-participation.delete-all-for-game', gameId);
  }
}
