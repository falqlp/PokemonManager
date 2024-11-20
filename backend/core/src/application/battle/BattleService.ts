import { IBattleInstance } from '../../domain/battleInstance/Battle';
import { Injectable } from '@nestjs/common';
import {
  CoreKafkaClientService,
  NeedReplyTopics,
} from '../core-kafka-client/core-kafka-client.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export default class BattleService {
  constructor(private readonly kafkaClientService: CoreKafkaClientService) {}

  public async simulateBattle(
    battle: IBattleInstance,
    date: Date,
  ): Promise<IBattleInstance> {
    return firstValueFrom(
      this.kafkaClientService
        .getClient()
        .send(NeedReplyTopics.simulateBattle, { battle, date }),
    );
  }
}
