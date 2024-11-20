import { Test, TestingModule } from '@nestjs/testing';
import {
  BattleInstanceBattle,
  CoreInterfaceService,
} from './core-interface.service';
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

  describe('getGame', () => {
    it('should send game.get', () => {
      const mockSend = jest.fn().mockReturnValue(of('mocked response'));
      const gameId = 'gameId';
      jest.spyOn(kafkaClientService, 'getClient').mockReturnValue({
        send: mockSend,
      } as unknown as ClientKafka);
      service.getGame(gameId);
      expect(kafkaClientService.getClient).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith(NeedReplyTopics.getGame, gameId);
    });
  });

  describe('getBattleInstance', () => {
    it('should send battleInstance.get', () => {
      const mockSend = jest.fn().mockReturnValue(of('mocked response'));
      const id = 'id';
      jest.spyOn(kafkaClientService, 'getClient').mockReturnValue({
        send: mockSend,
      } as unknown as ClientKafka);
      service.getBattleInstance(id);
      expect(kafkaClientService.getClient).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith(
        NeedReplyTopics.getBattleInstance,
        id,
      );
    });
  });

  describe('getBattleDate', () => {
    it('should send calendarEvent.getBattleDate', () => {
      const mockSend = jest.fn().mockReturnValue(of('mocked response'));
      const id = 'id';
      jest.spyOn(kafkaClientService, 'getClient').mockReturnValue({
        send: mockSend,
      } as unknown as ClientKafka);
      service.getBattleDate(id);
      expect(kafkaClientService.getClient).toHaveBeenCalled();
      expect(mockSend).toHaveBeenCalledWith(NeedReplyTopics.getBattleDate, id);
    });
  });

  describe('getTrainerList', () => {
    it('should send battleInstance.update', () => {
      const mockEmit = jest.fn().mockReturnValue(of('mocked response'));
      const battleId = 'battleId';
      const battle: BattleInstanceBattle = {
        _id: battleId,
      } as BattleInstanceBattle;
      jest.spyOn(kafkaClientService, 'getClient').mockReturnValue({
        emit: mockEmit,
      } as unknown as ClientKafka);
      service.updateBattleInstance(battle);
      expect(kafkaClientService.getClient).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalledWith('battleInstance.update', {
        battle,
        _id: battleId,
      });
    });
  });
});
