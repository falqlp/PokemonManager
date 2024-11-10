import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

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
    this.client.subscribeToResponseOf('pokemon.list');
    this.client.subscribeToResponseOf('trainer.list');
  }

  public getClient(): ClientKafka {
    return this.client;
  }
}
