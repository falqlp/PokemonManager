import { Test, TestingModule } from '@nestjs/testing';
import { BattleEventsController } from './battle-events.controller';
import { BattleEventService } from '../../application/battle-event/battle-event.service';

jest.mock('../../application/battle-event/battle-event.service');

describe('BattleEventsController', () => {
  let controller: BattleEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BattleEventsController],
      providers: [BattleEventService],
    }).compile();

    controller = module.get<BattleEventsController>(BattleEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
