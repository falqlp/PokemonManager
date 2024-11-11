import { Injectable } from '@nestjs/common';
import { KafkaClientService, NeedReplyTopics } from './kafka-client.service';
import { ListBody, MongoId } from 'shared/common';
import { IPokemon } from 'shared/models';
import { firstValueFrom } from 'rxjs';

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
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send<
          IPokemon[],
          unknown
        >(NeedReplyTopics.PokemonList, { body, gameId }),
    );
  }

  public async getTrainerList(
    body: ListBody,
    gameId: string,
  ): Promise<BattleStatsTrainer[]> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send<
          BattleStatsTrainer[],
          unknown
        >(NeedReplyTopics.TrainerList, { body, gameId }),
    );
  }
}
