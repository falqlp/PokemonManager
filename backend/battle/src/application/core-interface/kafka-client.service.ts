import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

export enum NeedReplyTopics {
  getBattleInstance = 'battleInstance.get',
  getGame = 'game.get',
  getBattleDate = 'calendarEvent.battleDate',
  getInitBattleReady = 'getInitBattleReady',
  getNextRoundStatus = 'getNextRoundStatus',
  getNextRoundLoopStatus = 'getNextRoundLoopStatus',
  addAskNextRound = 'addAskNextRound',
  addAskNextRoundLoop = 'addAskNextRoundLoop',
  resetNextRoundStatus = 'resetNextRoundStatus',
  setLoopMode = 'setLoopMode',
}

@Injectable()
export class KafkaClientService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'battle',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'battle',
      },
    },
  })
  private readonly client: ClientKafka;

  public onModuleInit(): void {
    Object.values(NeedReplyTopics).forEach((topic) => {
      this.getClient().subscribeToResponseOf(topic);
    });
  }

  public getClient(): ClientKafka {
    return this.client;
  }
}
