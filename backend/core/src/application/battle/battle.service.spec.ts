import BattleService from './battle.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CoreKafkaClientService,
  NeedReplyTopics,
} from '../core-kafka-client/core-kafka-client.service';
import { IBattleInstance } from '../../domain/battleInstance/Battle';
import { of, throwError } from 'rxjs';

describe('BattleService', () => {
  let service: BattleService;
  let kafkaClientService: CoreKafkaClientService;

  const mockKafkaClientService = {
    getClient: jest.fn().mockReturnValue({
      send: jest.fn().mockReturnValue(of()),
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleService,
        {
          provide: CoreKafkaClientService,
          useValue: mockKafkaClientService,
        },
      ],
    }).compile();

    service = module.get<BattleService>(BattleService);
    kafkaClientService = module.get(CoreKafkaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should simulate battle and return a battle instance', async () => {
    const mockBattle: IBattleInstance = {
      _id: 'battle',
    } as IBattleInstance;

    const mockDate = new Date();

    mockKafkaClientService.getClient().send.mockReturnValue(of(mockBattle));

    const result = await service.simulateBattle(mockBattle, mockDate);

    expect(result).toEqual(mockBattle);
    expect(kafkaClientService.getClient().send).toHaveBeenCalledWith(
      NeedReplyTopics.simulateBattle,
      { battle: mockBattle, date: mockDate },
    );
  });

  it('should handle errors gracefully', async () => {
    const mockBattle: IBattleInstance = {
      _id: 'battle',
    } as IBattleInstance;

    const mockDate = new Date();
    const mockError = new Error('Error while simulating battle');

    mockKafkaClientService
      .getClient()
      .send.mockImplementation(() => throwError(mockError));

    await expect(service.simulateBattle(mockBattle, mockDate)).rejects.toThrow(
      'Kafka Error',
    );
  });
});
