import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

export enum NeedReplyTopics {
  simulateBattle = 'battle.simulateBattle',
  ping = 'battle.ping',
}

@Injectable()
export class CoreKafkaClientService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'core',
        brokers: ['localhost:9092'],
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
