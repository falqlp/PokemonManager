import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

export enum NeedReplyTopics {
  PokemonList = 'pokemon.list',
  TrainerList = 'trainer.list',
}

@Injectable()
export class KafkaClientService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'battle-stats',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'battle-stats',
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
