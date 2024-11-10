import { Injectable } from '@nestjs/common';
import { KafkaClientService } from './kafka-client.service';
import { ListBody, MongoId } from 'shared/common';
import { IPokemon } from 'shared/models';

export interface BattleStatsTrainer extends MongoId {
  name: string;
  class?: string;
}

@Injectable()
export class CoreInterfaceService {
  constructor(private readonly kafkaClientService: KafkaClientService) {}

  public async getPokemonList(
    body: ListBody,
    gameId: string,
  ): Promise<IPokemon[]> {
    return this.kafkaClientService
      .getClient()
      .send<IPokemon[], unknown>('pokemon.list', { body, gameId })
      .toPromise();
  }

  public async getTrainerList(
    body: ListBody,
    gameId: string,
  ): Promise<BattleStatsTrainer[]> {
    return this.kafkaClientService
      .getClient()
      .send<BattleStatsTrainer[], unknown>('trainer.list', { body, gameId })
      .toPromise();
  }
}
