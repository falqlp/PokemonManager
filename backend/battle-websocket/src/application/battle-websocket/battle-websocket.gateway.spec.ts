import { Test, TestingModule } from '@nestjs/testing';
import { BattleWebsocketGateway } from './battle-websocket.gateway';

describe('BattleWebsocketGateway', () => {
  let gateway: BattleWebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleWebsocketGateway],
    }).compile();

    gateway = module.get<BattleWebsocketGateway>(BattleWebsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
