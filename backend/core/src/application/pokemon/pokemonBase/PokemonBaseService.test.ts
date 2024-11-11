import PokemonBaseService from './PokemonBaseService';
import { IWishList } from '../../../domain/trainer/nursery/Nursery';
import PokemonBaseRepository from '../../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import { PokemonBaseTestMother } from 'shared/models/test/domain/PokemonBase/PokemonBaseTestMother';
import { Test, TestingModule } from '@nestjs/testing';
import SpyInstance = jest.SpyInstance;

jest.mock('../../../domain/pokemon/pokemonBase/PokemonBaseRepository');

describe('PokemonBaseService', () => {
  let service: PokemonBaseService;
  let pokemonBaseRepository: PokemonBaseRepository;
  let wishlist: IWishList;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonBaseService, PokemonBaseRepository],
    }).compile();
    service = module.get<PokemonBaseService>(PokemonBaseService);
    pokemonBaseRepository = module.get<PokemonBaseRepository>(
      PokemonBaseRepository,
    );
    wishlist = {
      typeRepartition: {
        bug: 50,
        dark: 50,
        dragon: 0,
        electric: 0,
        fairy: 0,
        fighting: 0,
        fire: 0,
        flying: 0,
        ghost: 0,
        grass: 0,
        ground: 0,
        ice: 0,
        normal: 0,
        poison: 0,
        psy: 0,
        rock: 0,
        steel: 0,
        water: 0,
      },
      quantity: 2,
    };
  });

  describe('chooseTypeBasedOnWishlist method', () => {
    it('should return the type on wishlist with its repartition', () => {
      const results: Record<string, number> = {
        bug: 0,
        dark: 0,
        dragon: 0,
        electric: 0,
        fairy: 0,
        fighting: 0,
        fire: 0,
        flying: 0,
        ghost: 0,
        grass: 0,
        ground: 0,
        ice: 0,
        normal: 0,
        poison: 0,
        psy: 0,
        rock: 0,
        steel: 0,
        water: 0,
      };

      const numberOfTries = 10000;
      for (let i = 0; i < numberOfTries; i++) {
        const chosenType = service.chooseTypeBasedOnWishlist(wishlist);
        results[chosenType] += 1;
      }

      expect(results.bug).toBeGreaterThanOrEqual(4000);
      expect(results.bug).toBeLessThan(6000);
    });

    it('should return null if no valid type is found', () => {
      wishlist = {
        typeRepartition: {
          bug: 0,
          dark: 0,
          dragon: 0,
          electric: 0,
          fairy: 0,
          fighting: 0,
          fire: 0,
          flying: 0,
          ghost: 0,
          grass: 0,
          ground: 0,
          ice: 0,
          normal: 0,
          poison: 0,
          psy: 0,
          rock: 0,
          steel: 0,
          water: 0,
        },
        quantity: 2,
      };

      const result = service.chooseTypeBasedOnWishlist(wishlist);
      expect(result).toBeNull();
    });
  });

  describe('getDefaultQuery method', () => {
    it('should be defined', () => {
      const defaultQuery = service.getDefaultQuery();
      expect(defaultQuery).toBeDefined();
    });
  });

  describe('getBaseGenerationQuery method', () => {
    it('should be defined', () => {
      const baseGenerationQuery = service.getBaseGenerationQuery();
      expect(baseGenerationQuery).toBeDefined();
    });
  });

  describe('getTypeBasedQuery method', () => {
    it('should be defined', () => {
      const typeBasedQuery = service.getTypeBasedQuery('type');
      expect(typeBasedQuery).toBeDefined();
    });
  });

  describe('generateEggBase method', () => {
    let listSpy: SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      listSpy = jest
        .spyOn(pokemonBaseRepository, 'list')
        .mockResolvedValue([
          PokemonBaseTestMother.generateArticunoBase(),
          PokemonBaseTestMother.generateBulbasaurBase(),
        ]);
    });

    it('should call to repository to get a pokemon base', async () => {
      await service.generateEggBase(wishlist);
      expect(listSpy).toHaveBeenCalled();
    });

    it('should use type based on wishlist 90% of the time', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      const chooseTypeBasedOnWishlistSpy = jest.spyOn(
        service,
        'chooseTypeBasedOnWishlist',
      );
      await service.generateEggBase(wishlist);
      expect(chooseTypeBasedOnWishlistSpy).toHaveBeenCalledTimes(1);
      expect(listSpy).toHaveBeenCalled();
    });

    it('should use random type 10% of the time', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.01);
      const chooseTypeBasedOnWishlistSpy = jest.spyOn(
        service,
        'chooseTypeBasedOnWishlist',
      );
      await service.generateEggBase(wishlist);
      expect(chooseTypeBasedOnWishlistSpy).toHaveBeenCalledTimes(0);
      expect(listSpy).toHaveBeenCalled();
    });
  });
});
