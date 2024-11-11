import ColorService, { TRAINER_COLORS } from './color.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ColorService', () => {
  let colorService: ColorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorService],
    }).compile();

    colorService = module.get<ColorService>(ColorService);
  });

  describe('getColorForTrainer method', () => {
    it('should return a valid color for a string ID', () => {
      const randomID = 'randomID';
      const color = colorService.getColorForTrainer(randomID);
      expect(typeof color).toBe('string');
      expect(TRAINER_COLORS).toContain(color);
    });
  });
});
