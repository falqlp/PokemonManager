import { Test, TestingModule } from '@nestjs/testing';
import { CoreInterfaceService } from './core-interface.service';
import { KafkaClientService, NeedReplyTopics } from './kafka-client.service';
import { ClientKafka } from '@nestjs/microservices';
import { of } from 'rxjs';

jest.mock('./kafka-client.service');

describe('CoreInterfaceService', () => {
  let service: CoreInterfaceService;
  let kafkaClientService: KafkaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreInterfaceService, KafkaClientService],
    }).compile();

    service = module.get<CoreInterfaceService>(CoreInterfaceService);
    kafkaClientService = module.get<KafkaClientService>(KafkaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPokemonList', () => {
    it('should send pokemon.list', () => {
      const mockSend = jest.fn().mockReturnValue(of('mocked response'));
      const gameId = 'gameId';
      jest.spyOn(kafkaClientService, 'getClient').mockReturnValue({
        send: mockSend,
      } as unknown as ClientKafka);
      service.getPokemonList({}, gameId);
      expect(kafkaClientService.getClient).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith(NeedReplyTopics.PokemonList, {
        body: {},
        gameId,
      });
    });
  });

  describe('getTrainerList', () => {
    it('should send pokemon.list', () => {
      const mockSend = jest.fn().mockReturnValue(of('mocked response'));
      const gameId = 'gameId';
      jest.spyOn(kafkaClientService, 'getClient').mockReturnValue({
        send: mockSend,
      } as unknown as ClientKafka);
      service.getTrainerList({}, gameId);
      expect(kafkaClientService.getClient).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith(NeedReplyTopics.TrainerList, {
        body: {},
        gameId,
      });
    });
  });
});
