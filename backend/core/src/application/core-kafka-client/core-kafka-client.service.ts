import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class CoreKafkaClientService {
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

  public getClient(): ClientKafka {
    return this.client;
  }
}
