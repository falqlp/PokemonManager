import { Test, TestingModule } from '@nestjs/testing';
import { CoreInterfaceService } from './core-interface.service';
import { KafkaClientService } from './kafka-client.service';

jest.mock('./kafka-client.service');

describe('CoreInterfaceService', () => {
  let service: CoreInterfaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreInterfaceService, KafkaClientService],
    }).compile();

    service = module.get<CoreInterfaceService>(CoreInterfaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
