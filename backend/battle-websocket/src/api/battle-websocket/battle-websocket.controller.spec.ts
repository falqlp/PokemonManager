import { Test, TestingModule } from '@nestjs/testing';
import { BattleWebsocketController } from './battle-websocket.controller';

describe('BattleWebsocketController', () => {
  let controller: BattleWebsocketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BattleWebsocketController],
    }).compile();

    controller = module.get<BattleWebsocketController>(BattleWebsocketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
