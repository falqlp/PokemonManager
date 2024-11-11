import { Test, TestingModule } from '@nestjs/testing';
import ExperienceService from './ExperienceService';
import { PokemonTestMother } from 'shared/models/test/domain/pokemon/PokemonTestMother';
import PokemonService from '../pokemon/PokemonService';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import MoveLearningService from '../moveLearning/MoveLearningService';
import EvolutionRepository from '../../domain/evolution/EvolutionRepository';
import GameRepository from '../../domain/game/GameRepository';
import { IPokemon } from 'shared/models';

jest.mock('../pokemon/PokemonService');
jest.mock('../../domain/trainer/TrainerRepository');
jest.mock('../moveLearning/MoveLearningService');
jest.mock('../../domain/evolution/EvolutionRepository');
jest.mock('../../domain/game/GameRepository');

describe('ExperienceService', () => {
  let experienceService: ExperienceService;
  let pokemon: IPokemon;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        TrainerRepository,
        MoveLearningService,
        EvolutionRepository,
        GameRepository,
        PokemonService,
      ],
    }).compile();

    experienceService = module.get<ExperienceService>(ExperienceService);
  });

  describe('getXp', () => {
    beforeEach(() => {
      pokemon = PokemonTestMother.generateBulbasaur();
    });

    it('should return the correctly calculated experience points for a provided pokemon', () => {
      const xp = experienceService.getXp(pokemon, 1, new Date(Date.now()));
      expect(xp).toBeDefined();
      expect(xp).not.toBeNaN();
    });
  });

  describe('getLevel', () => {
    it('should return increased level when positive experience is provided', () => {
      const initialLevel = 1;
      const initialExp = 1000000;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toBeGreaterThan(initialLevel);
      expect(result.exp).toBeLessThan(initialExp);
      expect(result.variation).toBeGreaterThan(0);
    });

    it('should return decreased level when negative experience is provided', () => {
      const initialLevel = 50;
      const initialExp = -1000000;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toBeLessThan(initialLevel);
      expect(result.exp).toBeGreaterThanOrEqual(0);
      expect(result.variation).toBeGreaterThan(0);
    });

    it('should never return level more than 100 even with absurd experience', () => {
      const initialLevel = 90;
      const initialExp = 1e9;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toEqual(100);
      expect(result.exp).toBeLessThan(initialExp);
    });

    it('should never return level less than zero even with absurd negative experience', () => {
      const initialLevel = 10;
      const initialExp = -1e9;
      const result = experienceService.getLevel(initialLevel, initialExp);

      expect(result.level).toEqual(0);
      expect(result.exp).toEqual(0);
    });
  });

  describe('updateLevelAndXp', () => {
    it('should update the level and experience of a Pokémon', () => {
      const simplePokemon = PokemonTestMother.generateBulbasaur() as IPokemon;
      jest.spyOn(experienceService, 'getXp').mockReturnValue(10);
      jest.spyOn(experienceService, 'getLevel').mockReturnValue({
        level: simplePokemon.level,
        exp: simplePokemon.exp,
        variation: 0,
      });
      const date = new Date(Date.now());
      const result = experienceService.updateLevelAndXp(simplePokemon, 8, date);

      expect(result).toHaveProperty('pokemon');
      expect(result).toHaveProperty('variation');
      expect(result).toHaveProperty('xpGain');

      expect(experienceService.getXp).toHaveBeenCalledWith(
        simplePokemon,
        8,
        date,
      );
      expect(experienceService.getLevel).toHaveBeenCalledWith(
        simplePokemon.level,
        simplePokemon.exp + 10,
      );
    });
  });
});
