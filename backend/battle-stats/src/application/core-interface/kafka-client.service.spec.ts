import { Test, TestingModule } from '@nestjs/testing';
import { KafkaClientService } from './kafka-client.service';
import { ClientKafka } from '@nestjs/microservices';
import { NeedReplyTopics } from './core-interface.service';

describe('KafkaClientService', () => {
  let service: KafkaClientService;
  let clientKafkaMock: ClientKafka;

  beforeEach(async () => {
    clientKafkaMock = {
      subscribeToResponseOf: jest.fn(),
      connect: jest.fn(),
      emit: jest.fn(),
      send: jest.fn(),
    } as unknown as ClientKafka;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaClientService,
        {
          provide: ClientKafka,
          useValue: clientKafkaMock,
        },
      ],
    }).compile();

    service = module.get<KafkaClientService>(KafkaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should subscribe to topics on module init', () => {
    jest.spyOn(service, 'getClient').mockReturnValue(clientKafkaMock);
    service.onModuleInit();
    Object.values(NeedReplyTopics).forEach((topic) => {
      expect(clientKafkaMock.subscribeToResponseOf).toHaveBeenCalledWith(topic);
    });
  });
});
