import { Injectable } from '@nestjs/common';
import { KafkaClientService, NeedReplyTopics } from './kafka-client.service';
import { firstValueFrom } from 'rxjs';
import { MongoId } from 'shared/common';
import { IPokemon } from 'shared/models';

export interface BattleTrainer extends MongoId {
  name: string;
  class: string;
  pokemons: IPokemon[];
}

export interface BattleInstanceBattle extends MongoId {
  winner?: 'player' | 'opponent';
  player: BattleTrainer;
  opponent: BattleTrainer;
}

export interface BattleGame {
  players: { trainer: MongoId }[];
}

@Injectable()
export class CoreInterfaceService {
  constructor(private readonly kafkaClientService: KafkaClientService) {}

  public async getBattleInstance(
    battleId: string,
  ): Promise<BattleInstanceBattle> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send<
          BattleInstanceBattle,
          unknown
        >(NeedReplyTopics.getBattleInstance, battleId),
    );
  }

  public async getGame(gameId: string): Promise<BattleGame> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send<BattleGame, string>(NeedReplyTopics.getGame, gameId),
    );
  }

  public async getBattleDate(battleId: string): Promise<Date> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send<Date, string>(NeedReplyTopics.getBattleDate, battleId),
    );
  }

  public updateBattleInstance(battle: BattleInstanceBattle): void {
    this.kafkaClientService
      .getClient()
      .emit<void>('battleInstance.update', { _id: battle._id, battle });
  }
}
