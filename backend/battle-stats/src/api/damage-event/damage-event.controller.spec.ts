import { Test, TestingModule } from '@nestjs/testing';
import { DamageEventController } from './damage-event.controller';
import DamageEventRepository from '../../domain/battleevents/damageevent/DamageEventRepository';

jest.mock('../../domain/battleevents/damageevent/DamageEventRepository');

describe('DamageEventController', () => {
  let controller: DamageEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DamageEventController],
      providers: [DamageEventRepository],
    }).compile();

    controller = module.get<DamageEventController>(DamageEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
