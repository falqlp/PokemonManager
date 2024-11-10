import { Test, TestingModule } from '@nestjs/testing';
import { CoreKafkaClientService } from './core-kafka-client.service';

describe('CoreKafkaClientService', () => {
  let service: CoreKafkaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreKafkaClientService],
    }).compile();

    service = module.get<CoreKafkaClientService>(CoreKafkaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
