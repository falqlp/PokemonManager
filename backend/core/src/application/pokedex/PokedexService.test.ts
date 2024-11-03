import { Test, TestingModule } from '@nestjs/testing';
import { MoveTestMother } from '../../test/domain/Move/MoveTestMother';
import { IMoveLearning } from '../../domain/moveLearning/MoveLearning';
import { IPokedexMoveLearned } from './Pokedex';
import { PokemonBaseTestMother } from '../../test/domain/PokemonBase/PokemonBaseTestMother';
import { IEvolution } from '../../domain/evolution/Evolution';
import { PokedexService } from './PokedexService';
import PokemonBaseRepository from '../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import MoveRepository from '../../domain/move/MoveRepository';
import EvolutionRepository from '../../domain/evolution/EvolutionRepository';
import MoveLearningService from '../moveLearning/MoveLearningService';
import { IMove } from 'shared/models';

jest.mock('../../domain/pokemon/pokemonBase/PokemonBaseRepository');
jest.mock('../../domain/move/MoveRepository');
jest.mock('../../domain/evolution/EvolutionRepository');
jest.mock('../moveLearning/MoveLearningService');

describe('PokedexService', () => {
  let pokedexService: PokedexService;
  let pokemonBaseRepository: jest.Mocked<PokemonBaseRepository>;
  let moveLearningService: jest.Mocked<MoveLearningService>;
  let moveService: jest.Mocked<MoveRepository>;
  let evolutionRepository: jest.Mocked<EvolutionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokedexService,
        PokemonBaseRepository,
        MoveLearningService,
        MoveRepository,
        EvolutionRepository,
      ],
    }).compile();

    pokedexService = module.get<PokedexService>(PokedexService);
    pokemonBaseRepository = module.get(PokemonBaseRepository);
    moveLearningService = module.get(MoveLearningService);
    moveService = module.get(MoveRepository);
    evolutionRepository = module.get(EvolutionRepository);

    jest.clearAllMocks();
  });

  describe('getPokemonDetails', () => {
    beforeEach(() => {
      jest.spyOn(pokemonBaseRepository, 'getPokemonBaseById');
    });

    it('Should return the pokemon details with evolutions, evolutionOf, pokemonBase and movesLearned', async () => {
      jest
        .spyOn(pokemonBaseRepository, 'getPokemonBaseById')
        .mockResolvedValue(PokemonBaseTestMother.generateBulbasaurBase());
      jest.spyOn(evolutionRepository, 'hasEvolution').mockResolvedValue([]);
      jest.spyOn(evolutionRepository, 'isEvolution').mockResolvedValue(null);
      jest
        .spyOn(moveLearningService, 'getMovesOfAllEvolutions')
        .mockResolvedValue([]);

      const pokemonId = 1;
      const result = await pokedexService.getPokemonDetails(pokemonId);

      expect(result).toEqual(
        expect.objectContaining({
          evolutions: expect.any(Array),
          evolutionOf: expect.any(Array),
          pokemonBase: expect.objectContaining({ id: pokemonId }),
          movesLearned: expect.any(Array),
        }),
      );
      expect(pokemonBaseRepository.getPokemonBaseById).toHaveBeenCalledWith(
        pokemonId,
      );
      expect(evolutionRepository.hasEvolution).toHaveBeenCalledWith(pokemonId);
      expect(evolutionRepository.isEvolution).toHaveBeenCalledWith(pokemonId);
      expect(moveLearningService.getMovesOfAllEvolutions).toHaveBeenCalledWith(
        pokemonId,
        100,
      );
    });
  });

  describe('getEvolutions', () => {
    it('should return the evolutions of the pokemon', async () => {
      const pokemonId = 1;
      const pokemonBase = PokemonBaseTestMother.generateBulbasaurBase();

      const evolution: IEvolution = {
        pokemonId,
        evolveTo: 2,
        evolutionMethod: 'level-up',
        minLevel: 16,
      };

      jest
        .spyOn(evolutionRepository, 'hasEvolution')
        .mockResolvedValue([evolution]);
      jest
        .spyOn(pokemonBaseRepository, 'getPokemonBaseById')
        .mockResolvedValue(pokemonBase);

      const result = await pokedexService.getEvolutions(pokemonId);

      expect(result).toEqual([
        { evolutionMethod: 'level-up', minLevel: 16, pokemon: pokemonBase },
        { evolutionMethod: 'level-up', minLevel: 16, pokemon: pokemonBase },
      ]);
      expect(pokemonBaseRepository.getPokemonBaseById).toHaveBeenCalledTimes(2);
      expect(evolutionRepository.hasEvolution).toHaveBeenCalledWith(pokemonId);
    });
  });

  describe('getEvolutionOf', () => {
    it('should return the evolved forms of the pokemon', async () => {
      const pokemonId = 1;
      const pokemonBase = PokemonBaseTestMother.generateBulbasaurBase();

      const evolution: IEvolution = {
        pokemonId,
        evolutionMethod: 'level-up',
        minLevel: 16,
        evolveTo: 1,
      };

      jest
        .spyOn(evolutionRepository, 'isEvolution')
        .mockResolvedValue(evolution);
      jest
        .spyOn(pokemonBaseRepository, 'getPokemonBaseById')
        .mockResolvedValue(pokemonBase);

      const result = await pokedexService.getEvolutionOf(pokemonId);

      expect(result).toEqual([
        { pokemon: pokemonBase, evolutionMethod: 'level-up', minLevel: 16 },
        { pokemon: pokemonBase, evolutionMethod: 'level-up', minLevel: 16 },
      ]);
      expect(evolutionRepository.isEvolution).toHaveBeenCalledWith(pokemonId);
      expect(pokemonBaseRepository.getPokemonBaseById).toHaveBeenCalledWith(
        evolution.evolveTo,
      );
    });
  });

  describe('getMovesLearned', () => {
    it('should return a list of moves learned by a Pokemon, sorted by level needed to learn', async () => {
      const pokemonId = 1;

      const moveLearning: IMoveLearning = {
        moveId: '1',
        levelLearnAt: 5,
        learnMethod: 'level-up',
        pokemonId: 1,
      };

      const move: IMove = MoveTestMother.basicMove();

      jest
        .spyOn(moveLearningService, 'getMovesOfAllEvolutions')
        .mockResolvedValue([moveLearning]);
      jest.spyOn(moveService, 'get').mockResolvedValue(move);

      const result = await pokedexService.getMovesLearned(pokemonId);

      const expected: IPokedexMoveLearned = {
        move,
        levelLearnAt: moveLearning.levelLearnAt,
        learnMethod: moveLearning.learnMethod,
      };

      expect(result).toEqual([expected]);
      expect(moveLearningService.getMovesOfAllEvolutions).toHaveBeenCalledWith(
        pokemonId,
        100,
      );
      expect(moveService.get).toHaveBeenCalledWith(moveLearning.moveId);
    });

    it('should not return a move if power is 0 or less', async () => {
      const pokemonId = 1;

      const moveLearning: IMoveLearning = {
        moveId: '1',
        levelLearnAt: 5,
        learnMethod: 'level-up',
        pokemonId,
      };

      const move: IMove = MoveTestMother.withCustomOptions({
        power: undefined,
      });

      jest
        .spyOn(moveLearningService, 'getMovesOfAllEvolutions')
        .mockResolvedValue([moveLearning]);
      jest.spyOn(moveService, 'get').mockResolvedValue(move);

      const result = await pokedexService.getMovesLearned(pokemonId);

      expect(result).toEqual([]);
      expect(moveLearningService.getMovesOfAllEvolutions).toHaveBeenCalledWith(
        pokemonId,
        100,
      );
      expect(moveService.get).toHaveBeenCalledWith(moveLearning.moveId);
    });
  });
});
