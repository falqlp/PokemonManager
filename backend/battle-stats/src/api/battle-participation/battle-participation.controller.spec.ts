import { Test, TestingModule } from '@nestjs/testing';
import { BattleParticipationController } from './battle-participation.controller';
import BattleParticipationEventRepository from '../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository';

jest.mock(
  '../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository',
);

describe('BattleParticipationController', () => {
  let controller: BattleParticipationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BattleParticipationController],
      providers: [BattleParticipationEventRepository],
    }).compile();

    controller = module.get<BattleParticipationController>(
      BattleParticipationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
