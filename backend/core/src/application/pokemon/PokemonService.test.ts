import { Test, TestingModule } from '@nestjs/testing';
import PokemonService from './PokemonService';
import { INursery } from '../../domain/trainer/nursery/Nursery';
import { NurseryTestMother } from '../../test/domain/Nursery/NurseryTestMother';
import { addYears } from '../../utils/DateUtils';
import { IMove } from '../../domain/move/Move';
import { IPokemon, PokemonNature } from '../../domain/pokemon/Pokemon';
import { PokemonTestMother } from '../../test/domain/pokemon/PokemonTestMother';
import { MoveTestMother } from '../../test/domain/Move/MoveTestMother';
import { StatsTestMother } from '../../test/domain/Stats/StatsTestMother';
import { IGame } from '../../domain/game/Game';
import { Gender } from '../../domain/Gender';
import PokemonBaseService from './pokemonBase/PokemonBaseService';
import PokemonBaseRepository from '../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import EvolutionRepository from '../../domain/evolution/EvolutionRepository';
import GameRepository from '../../domain/game/GameRepository';
import PokemonUtilsService from './PokemonUtilsService';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import PokemonRepository from '../../domain/pokemon/PokemonRepository';
import MoveLearningService from '../moveLearning/MoveLearningService';

jest.mock('./pokemonBase/PokemonBaseService');
jest.mock('../../domain/pokemon/pokemonBase/PokemonBaseRepository');
jest.mock('../../domain/evolution/EvolutionRepository');
jest.mock('../../domain/game/GameRepository');
jest.mock('../../domain/trainer/TrainerRepository');
jest.mock('../../websocket/WebsocketUtils');
jest.mock('../../domain/pokemon/PokemonRepository');
jest.mock('../moveLearning/MoveLearningService');

describe('PokemonService', () => {
  let service: PokemonService;
  let gameRepository: GameRepository;
  let pokemonUtilsService: PokemonUtilsService;
  let pokemonRepository: PokemonRepository;
  let trainerRepository: TrainerRepository;
  let websocketUtils: WebsocketUtils;
  let moveLearningService: MoveLearningService;
  let pokemonBaseRepository: PokemonBaseRepository;
  let evolutionRepository: EvolutionRepository;
  let pokemonBaseService: PokemonBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        GameRepository,
        PokemonUtilsService,
        TrainerRepository,
        WebsocketUtils,
        PokemonRepository,
        MoveLearningService,
        PokemonBaseService,
        PokemonBaseRepository,
        EvolutionRepository,
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    gameRepository = module.get<GameRepository>(GameRepository);
    pokemonUtilsService = module.get<PokemonUtilsService>(PokemonUtilsService);
    trainerRepository = module.get<TrainerRepository>(TrainerRepository);
    websocketUtils = module.get<WebsocketUtils>(WebsocketUtils);
    pokemonRepository = module.get<PokemonRepository>(PokemonRepository);
    moveLearningService = module.get<MoveLearningService>(MoveLearningService);
    evolutionRepository = module.get<EvolutionRepository>(EvolutionRepository);
    pokemonBaseRepository = module.get<PokemonBaseRepository>(
      PokemonBaseRepository,
    );
    pokemonBaseService = module.get(PokemonBaseService);

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('updateBase method', () => {
    let actualDate: Date;
    beforeEach(() => {
      actualDate = new Date();
    });

    it('should update the base properties of a pokemon correctly', () => {
      const oldPokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const newPokemon: IPokemon = {
        ...oldPokemon,
        ev: null,
        iv: null,
        strategy: null,
        basePokemon: null,
        nature: null,
        stats: null,
        birthday: null,
        moves: null,
        maxLevel: null,
      };

      const updatedPokemon = service.updateBase(
        newPokemon,
        oldPokemon,
        actualDate,
      );

      expect(updatedPokemon.ev).toEqual(oldPokemon.ev);
      expect(updatedPokemon.iv).toEqual(oldPokemon.iv);
      expect(updatedPokemon.strategy).toEqual([]);
      expect(updatedPokemon.basePokemon).toEqual(oldPokemon.basePokemon);
      expect(updatedPokemon.nature).toEqual(PokemonNature.HARDY);
      expect(updatedPokemon.stats).toEqual(oldPokemon.stats);
      expect(updatedPokemon.birthday).toEqual(oldPokemon.birthday);
      expect(updatedPokemon.moves).toEqual(oldPokemon.moves);
      expect(updatedPokemon.maxLevel).toEqual(oldPokemon.maxLevel);
      expect(updatedPokemon.birthday).toEqual(oldPokemon.birthday);
    });

    it('should set the birthday to actual date if not present', () => {
      const oldPokemon: IPokemon = {
        ...PokemonTestMother.generateBulbasaur(),
        birthday: null,
      };
      const newPokemon: IPokemon = { ...oldPokemon, birthday: null };

      const updatedPokemon = service.updateBase(
        newPokemon,
        oldPokemon,
        actualDate,
      );

      expect(updatedPokemon.birthday).toEqual(actualDate);
    });

    it('should correctly assign default strategies when none are provided', () => {
      const oldPokemon: IPokemon = {
        ...PokemonTestMother.generateBulbasaur(),
        strategy: null,
      };
      const newPokemon: IPokemon = { ...oldPokemon, strategy: null };
      const actualDate = new Date();

      const updatedPokemon = service.updateBase(
        newPokemon,
        oldPokemon,
        actualDate,
      );

      expect(updatedPokemon.strategy.length).toEqual(newPokemon.moves.length);
      expect(updatedPokemon.strategy).toEqual([9, 9]);
    });

    it('should maintain existing strategies if present', () => {
      const oldPokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const newPokemon: IPokemon = { ...oldPokemon, strategy: [1, 2, 3] };
      const actualDate = new Date();

      const updatedPokemon = service.updateBase(
        newPokemon,
        oldPokemon,
        actualDate,
      );

      expect(updatedPokemon.strategy).toEqual([1, 2, 3]);
    });
  });

  describe('create method', () => {
    let actualDate: Date;
    let pokemon: IPokemon;

    beforeEach(() => {
      pokemon = PokemonTestMother.generateBulbasaur();
      jest.clearAllMocks();
      jest.resetAllMocks();
      actualDate = new Date();
      jest
        .spyOn(gameRepository, 'get')
        .mockResolvedValue({ actualDate } as IGame);
      jest.spyOn(service, 'createEgg').mockReturnValue(pokemon);
      jest.spyOn(service, 'createPokemon').mockReturnValue(pokemon);
      jest.spyOn(service, 'savePokemon').mockResolvedValue(pokemon);
      jest.spyOn(pokemonUtilsService, 'generateShiny').mockReturnValue(false);
    });

    it('should create an egg when level is 0', async () => {
      pokemon = { ...pokemon, level: 0 };
      const gameId = 'gameId';

      const createdPokemon = await service.create(pokemon, gameId);

      expect(service.createEgg).toHaveBeenCalledWith(
        pokemon,
        gameId,
        actualDate,
      );
      expect(service.createPokemon).not.toHaveBeenCalled();
      expect(createdPokemon.shiny).toBe(false);
      expect(service.savePokemon).toHaveBeenCalledWith(
        expect.any(Object),
        gameId,
      );
    });

    it('should create a regular pokemon when level is greater than 0', async () => {
      pokemon = { ...pokemon, level: 10 };
      const gameId = 'gameId';

      const createdPokemon = await service.create(pokemon, gameId);

      expect(service.createPokemon).toHaveBeenCalledWith(
        pokemon,
        gameId,
        actualDate,
      );
      expect(service.createEgg).not.toHaveBeenCalled();
      expect(createdPokemon.shiny).toBe(false);
      expect(service.savePokemon).toHaveBeenCalledWith(
        expect.any(Object),
        gameId,
      );
    });

    it('should set shiny property if not provided', async () => {
      pokemon = { ...pokemon, shiny: undefined };
      const gameId = 'gameId';

      jest.spyOn(pokemonUtilsService, 'generateShiny').mockReturnValue(true);

      await service.create(pokemon, gameId);

      expect(service.savePokemon).toHaveBeenCalledWith(
        { ...pokemon, shiny: true },
        gameId,
      );
    });
  });

  describe('createPokemon method', () => {
    it('should initialize properties correctly when creating a new Pokemon', async () => {
      const basePokemon = PokemonTestMother.generateBulbasaur();
      const newPokemon: IPokemon = {
        ...basePokemon,
        nickname: '',
        happiness: undefined,
        gender: undefined,
        exp: undefined,
        iv: undefined,
        ev: undefined,
        nature: undefined,
        trainingPercentage: undefined,
        birthday: undefined,
        potential: undefined,
        hiddenPotential: undefined,
        strategy: undefined,
      };
      const gameId = 'gameId';
      const actualDate = new Date();

      const createdPokemon = service.createPokemon(
        newPokemon,
        gameId,
        actualDate,
      );

      expect(createdPokemon.gameId).toBe(gameId);
      expect(createdPokemon.nickname).toBeNull();
      expect(createdPokemon.happiness).toBe(
        basePokemon.basePokemon.baseHappiness,
      );
      expect([Gender.MALE, Gender.FEMALE, Gender.NONE]).toContain(
        createdPokemon.gender,
      );
      expect(createdPokemon.exp).toBe(0);
      expect(createdPokemon.iv).toBeDefined();
      expect(createdPokemon.ev).toBeDefined();
      expect(createdPokemon.nature).toBeDefined();
      expect(createdPokemon.trainingPercentage).toBe(0);
      expect(createdPokemon.birthday).toEqual(actualDate);
      expect(createdPokemon.potential).toBe(100);
      expect(createdPokemon.hiddenPotential).toBeDefined();
      expect(createdPokemon.strategy).toEqual([]);
      expect(createdPokemon.stats).toBeDefined();
      expect(createdPokemon.maxLevel).toBeDefined();
    });

    it('should not override existing properties', async () => {
      const basePokemon = PokemonTestMother.generateBulbasaur();
      const newPokemon: IPokemon = {
        ...basePokemon,
        nickname: 'Bulby',
        happiness: 200,
        gender: Gender.FEMALE,
        exp: 1000,
        iv: { spe: 15, spDef: 15, spAtk: 15, def: 15, atk: 15, hp: 15 },
        ev: { spe: 10, spDef: 10, spAtk: 10, def: 10, atk: 10, hp: 10 },
        nature: PokemonNature.BOLD,
        trainingPercentage: 50,
        birthday: new Date('2000-01-01'),
        potential: 90,
        hiddenPotential: '90-90',
        strategy: [1, 2, 3],
      };
      const gameId = 'gameId';
      const actualDate = new Date();

      const createdPokemon = service.createPokemon(
        newPokemon,
        gameId,
        actualDate,
      );

      expect(createdPokemon.nickname).toBe('Bulby');
      expect(createdPokemon.happiness).toBe(200);
      expect(createdPokemon.gender).toBe(Gender.FEMALE);
      expect(createdPokemon.exp).toBe(1000);
      expect(createdPokemon.iv).toEqual({
        spe: 15,
        spDef: 15,
        spAtk: 15,
        def: 15,
        atk: 15,
        hp: 15,
      });
      expect(createdPokemon.ev).toEqual({
        spe: 10,
        spDef: 10,
        spAtk: 10,
        def: 10,
        atk: 10,
        hp: 10,
      });
      expect(createdPokemon.nature).toBe('BOLD');
      expect(createdPokemon.trainingPercentage).toBe(50);
      expect(createdPokemon.birthday).toEqual(new Date('2000-01-01'));
      expect(createdPokemon.potential).toBe(90);
      expect(createdPokemon.hiddenPotential).toBeDefined();
      expect(createdPokemon.strategy).toEqual([1, 2, 3]);
    });
  });

  describe('createEgg method', () => {
    it('should create an egg and set the hatching date correctly', async () => {
      const basePokemon = PokemonTestMother.generateBulbasaur();
      const newPokemon: IPokemon = {
        ...basePokemon,
        birthday: new Date(Date.UTC(2023, 0, 0)),
      };
      const gameId = 'gameId';
      const actualDate = new Date();

      jest.spyOn(service, 'createPokemon').mockReturnValue(newPokemon);

      const eggPokemon = service.createEgg(newPokemon, gameId, actualDate);

      expect(service.createPokemon).toHaveBeenCalledWith(
        newPokemon,
        gameId,
        actualDate,
      );
      expect(eggPokemon.hatchingDate).toEqual(new Date(Date.UTC(2023, 3, 0)));
      expect(eggPokemon.birthday).toBeUndefined();
    });
  });

  describe('savePokemon method', () => {
    let newPokemon: IPokemon;
    beforeEach(() => {
      newPokemon = PokemonTestMother.generateBulbasaur();
      jest.resetAllMocks();
      jest.clearAllMocks();
      jest.restoreAllMocks();
      jest.spyOn(pokemonRepository, 'create').mockResolvedValue(newPokemon);
      jest.spyOn(websocketUtils, 'updatePlayer').mockResolvedValue();
      jest.spyOn(trainerRepository, 'findOneAndUpdate').mockResolvedValue(null);
    });
    it('should save the pokemon and update the trainer if trainerId is present', async () => {
      const gameId = 'gameId';

      const createdPokemon = await service.savePokemon(newPokemon, gameId);

      expect(pokemonRepository.create).toHaveBeenCalledWith({
        ...newPokemon,
        gameId,
      });
      expect(websocketUtils.updatePlayer).toHaveBeenCalledWith(
        newPokemon.trainerId,
        gameId,
      );
      expect(trainerRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: newPokemon.trainerId },
        { $push: { pokemons: newPokemon._id } },
      );
      expect(createdPokemon).toEqual(newPokemon);
    });

    it('should save the pokemon without updating the trainer if trainerId is not present', async () => {
      newPokemon = {
        ...newPokemon,
        trainerId: undefined,
      };
      jest.spyOn(pokemonRepository, 'create').mockResolvedValue({
        ...newPokemon,
        trainerId: undefined,
      });
      const gameId = 'gameId';

      const createdPokemon = await service.savePokemon(newPokemon, gameId);

      expect(pokemonRepository.create).toHaveBeenCalledWith({
        ...newPokemon,
        gameId,
      });
      expect(websocketUtils.updatePlayer).not.toHaveBeenCalled();
      expect(trainerRepository.findOneAndUpdate).not.toHaveBeenCalled();
      expect(createdPokemon).toEqual(newPokemon);
    });
  });

  describe('isHatched method', () => {
    beforeEach(() => {
      jest
        .spyOn(pokemonRepository, 'list')
        .mockResolvedValue([PokemonTestMother.generateBulbasaur()]);
      jest.spyOn(websocketUtils, 'eggHatched').mockImplementation(jest.fn());
    });
    it('should handle hatched eggs correctly', async () => {
      const actualDate = new Date();
      const gameId = 'gameId';

      await service.isHatched(actualDate, gameId);

      expect(pokemonRepository.list).toHaveBeenCalledWith(
        { custom: { hatchingDate: { $lte: actualDate } } },
        { gameId },
      );
      expect(websocketUtils.eggHatched).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(websocketUtils.eggHatched).toHaveBeenCalledTimes(1);
    });

    it('should not call eggHatched if no eggs are hatched', async () => {
      jest.spyOn(pokemonRepository, 'list').mockResolvedValue([]);

      const actualDate = new Date();
      const gameId = 'gameId';

      await service.isHatched(actualDate, gameId);

      expect(pokemonRepository.list).toHaveBeenCalledWith(
        { custom: { hatchingDate: { $lte: actualDate } } },
        { gameId },
      );
      expect(websocketUtils.eggHatched).not.toHaveBeenCalled();
    });
  });
  describe('generateEgg method', () => {
    let pokemon: IPokemon;
    beforeEach(() => {
      pokemon = PokemonTestMother.generateBulbasaur();

      jest.spyOn(pokemonUtilsService, 'generatePotential').mockReturnValue(100);
      jest
        .spyOn(pokemonBaseService, 'generateEggBase')
        .mockResolvedValue(pokemon.basePokemon);
      jest.spyOn(service, 'create').mockResolvedValue(pokemon);
    });
    it('should generate an egg with the correct properties', async () => {
      const nursery: INursery = NurseryTestMother.basicNursery();
      const gameId = 'gameId';

      const generatedEgg = await service.generateEgg(nursery, gameId);

      expect(pokemonUtilsService.generatePotential).toHaveBeenCalledWith(
        nursery.level,
      );
      expect(pokemonBaseService.generateEggBase).toHaveBeenCalledWith(
        nursery.wishList,
      );
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          basePokemon: pokemon.basePokemon,
          level: 0,
          potential: 100,
        }),
        gameId,
      );
      expect(generatedEgg).toEqual(pokemon);
    });
  });

  describe('generateStarters method', () => {
    beforeEach(() => {
      jest
        .spyOn(gameRepository, 'get')
        .mockResolvedValue({ actualDate: new Date('2023-01-01') } as IGame);
      jest
        .spyOn(pokemonBaseRepository, 'getStartersBase')
        .mockResolvedValue([PokemonTestMother.generateBulbasaur().basePokemon]);
      jest.spyOn(evolutionRepository, 'maxEvolution').mockResolvedValue(null);
      jest
        .spyOn(moveLearningService, 'learnableMoves')
        .mockResolvedValue([
          MoveTestMother.basicMove(),
          MoveTestMother.powerfulMove(),
        ]);
      jest
        .spyOn(pokemonUtilsService, 'generateIvs')
        .mockReturnValue(StatsTestMother.getIVs());
      jest
        .spyOn(pokemonUtilsService, 'initEvs')
        .mockReturnValue(StatsTestMother.getAll0());
      jest.spyOn(pokemonUtilsService, 'generateShiny').mockReturnValue(false);
    });
    it('should generate starter Pokemon with the correct properties', async () => {
      const gameId = 'gameId';
      const trainerId = 'trainerId';

      const starters = await service.generateStarters(gameId, trainerId);

      expect(gameRepository.get).toHaveBeenCalledWith(gameId);
      expect(pokemonBaseRepository.getStartersBase).toHaveBeenCalledWith(
        trainerId,
      );
      expect(evolutionRepository.maxEvolution).toHaveBeenCalledWith(
        expect.any(Number),
        10,
        'LEVEL-UP',
      );
      expect(moveLearningService.learnableMoves).toHaveBeenCalledWith(
        expect.any(Number),
        10,
        { sort: { power: -1 } },
      );
      expect(starters.length).toBe(1);

      const starter = starters[0];
      expect(starter.basePokemon).toEqual(
        PokemonTestMother.generateBulbasaur().basePokemon,
      );
      expect(starter.level).toBe(10);
      expect(starter.potential).toBe(30);
      expect(starter.exp).toBe(0);
      expect(starter.iv).toEqual(StatsTestMother.getIVs());
      expect(starter.ev).toEqual(StatsTestMother.getAll0());
      expect(starter.happiness).toBe(
        PokemonTestMother.generateBulbasaur().basePokemon.baseHappiness,
      );
      expect(starter.gameId).toBe(gameId);
      expect(starter.moves).toEqual([
        MoveTestMother.basicMove(),
        MoveTestMother.powerfulMove(),
      ]);
      expect(starter.trainerId).toBeNull();
      expect(starter.nickname).toBeNull();
      expect(starter.shiny).toBe(false);
      expect(starter.birthday).toEqual(addYears(new Date('2023-01-01'), -1));
      expect(starter.hatchingDate).toBeNull();
      expect(starter.trainingPercentage).toBe(0);
      expect(starter.maxLevel).toBe(10);
    });
  });
  describe('createPokemons method', () => {
    let pokemon: IPokemon;
    beforeEach(() => {
      pokemon = PokemonTestMother.generateBulbasaur();
      jest
        .spyOn(gameRepository, 'get')
        .mockResolvedValue({ actualDate: new Date('2023-01-01') } as IGame);
      jest.spyOn(service, 'createPokemon').mockReturnValue(pokemon);
      jest.spyOn(pokemonRepository, 'insertMany').mockResolvedValue([pokemon]);
    });
    it('should create multiple Pokemons and save them to the repository', async () => {
      const pokemons: IPokemon[] = [
        PokemonTestMother.generateBulbasaur(),
        PokemonTestMother.generateArticuno(),
      ];
      const gameId = 'gameId';

      const createdPokemons = await service.createPokemons(pokemons, gameId);

      expect(gameRepository.get).toHaveBeenCalledWith(gameId);
      expect(service.createPokemon).toHaveBeenCalledTimes(pokemons.length);
      for (const pokemon of pokemons) {
        expect(service.createPokemon).toHaveBeenCalledWith(
          pokemon,
          gameId,
          new Date('2023-01-01'),
        );
      }
      expect(pokemonRepository.insertMany).toHaveBeenCalledWith(pokemons);
      expect(createdPokemons).toEqual([pokemon]);
    });
  });
  describe('update method', () => {
    let pokemon: IPokemon;
    beforeEach(() => {
      pokemon = PokemonTestMother.generateBulbasaur();
      jest.spyOn(pokemonRepository, 'get').mockResolvedValue(pokemon);
      jest
        .spyOn(gameRepository, 'get')
        .mockResolvedValue({ actualDate: new Date('2023-01-01') } as IGame);
      jest.spyOn(pokemonRepository, 'findOneAndUpdate').mockResolvedValue(null);
      jest.spyOn(pokemonRepository, 'update').mockResolvedValue(pokemon);
      jest.spyOn(websocketUtils, 'updatePlayer').mockResolvedValue(null);
      jest
        .spyOn(service, 'updateBase')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((pokemon, oldPokemon, actualDate) => pokemon);
    });
    it('should update the pokemon and handle hatching date if level changes to 1', async () => {
      const _id = 'bulbasaurId';
      const updatedPokemon: IPokemon = {
        ...pokemon,
        level: 1,
      };

      const result = await service.update(_id, updatedPokemon);

      expect(pokemonRepository.get).toHaveBeenCalledWith(_id);
      expect(gameRepository.get).toHaveBeenCalledWith(updatedPokemon.gameId);
      expect(service.updateBase).toHaveBeenCalledWith(
        updatedPokemon,
        expect.any(Object),
        new Date('2023-01-01'),
      );
      expect(pokemonRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id },
        { $set: { hatchingDate: null } },
      );
      expect(updatedPokemon.hatchingDate).toBeNull();
      expect(websocketUtils.updatePlayer).toHaveBeenCalledWith(
        updatedPokemon.trainerId ?? expect.any(String),
        updatedPokemon.gameId,
      );
      expect(pokemonRepository.update).toHaveBeenCalledWith(
        _id,
        updatedPokemon,
      );
      expect(result).toEqual(pokemon);
    });

    it('should update the pokemon without changing hatching date if level does not change to 1', async () => {
      const _id = 'bulbasaurId';
      const updatedPokemon: IPokemon = {
        ...pokemon,
        level: 10,
      };

      const result = await service.update(_id, updatedPokemon);

      expect(pokemonRepository.get).toHaveBeenCalledWith(_id);
      expect(gameRepository.get).toHaveBeenCalledWith(updatedPokemon.gameId);
      expect(service.updateBase).toHaveBeenCalledWith(
        updatedPokemon,
        expect.any(Object),
        new Date('2023-01-01'),
      );
      expect(pokemonRepository.findOneAndUpdate).not.toHaveBeenCalled();
      expect(updatedPokemon.hatchingDate).not.toBeNull();
      expect(websocketUtils.updatePlayer).toHaveBeenCalledWith(
        updatedPokemon.trainerId ?? expect.any(String),
        updatedPokemon.gameId,
      );
      expect(pokemonRepository.update).toHaveBeenCalledWith(
        _id,
        updatedPokemon,
      );
      expect(result).toEqual(pokemon);
    });
  });

  describe('updateMany method', () => {
    let pokemons: IPokemon[];
    beforeEach(() => {
      pokemons = [
        PokemonTestMother.generateBulbasaur(),
        PokemonTestMother.generateArticuno(),
      ];
      jest
        .spyOn(gameRepository, 'get')
        .mockResolvedValue({ actualDate: new Date('2023-01-01') } as IGame);
      jest.spyOn(pokemonRepository, 'list').mockResolvedValue(pokemons);
      jest.spyOn(pokemonRepository, 'updateMany').mockResolvedValue(pokemons);
      jest
        .spyOn(service, 'updateBase')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((pokemon, oldPokemon, actualDate) => pokemon);
    });
    it('should update multiple Pokemons and save them to the repository', async () => {
      const pokemonsToUpdate: IPokemon[] = pokemons;
      const gameId = 'gameId';

      const updatedPokemons = await service.updateMany(
        pokemonsToUpdate,
        gameId,
      );

      expect(gameRepository.get).toHaveBeenCalledWith(gameId);
      expect(pokemonRepository.list).toHaveBeenCalledWith({
        ids: pokemonsToUpdate.map((pokemon) => pokemon._id),
      });
      expect(service.updateBase).toHaveBeenCalledTimes(pokemonsToUpdate.length);
      for (let i = 0; i < pokemonsToUpdate.length; i++) {
        expect(service.updateBase).toHaveBeenCalledWith(
          pokemonsToUpdate[i],
          expect.any(Object),
          new Date('2023-01-01'),
        );
      }
      expect(pokemonRepository.updateMany).toHaveBeenCalledWith(
        pokemonsToUpdate,
      );
      expect(updatedPokemons).toEqual(pokemons);
    });
  });
  describe('changeNickname', () => {
    let getPokemonSpy: jest.SpyInstance;
    beforeEach(() => {
      getPokemonSpy = jest.spyOn(pokemonRepository, 'get');
    });
    it('should change the nickname of a pokemon', async () => {
      const pokemonId = 'pokemonId';
      const nickname = 'NewNickname';
      const gameId = 'gameId';
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        nickname: 'OldNickname',
      } as IPokemon;

      getPokemonSpy.mockResolvedValue(pokemon);
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(pokemon);

      await service.changeNickname(pokemonId, nickname, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(pokemonId, {
        gameId,
      });
      expect(pokemon.nickname).toBe(nickname);
      expect(updateSpy).toHaveBeenCalledWith(pokemonId, pokemon);
    });

    it('should not change the nickname if pokemon is not found', async () => {
      const pokemonId = 'pokemonId';
      const nickname = 'NewNickname';
      const gameId = 'gameId';

      getPokemonSpy.mockResolvedValue(null);
      const updateSpy = jest.spyOn(service, 'update');

      await service.changeNickname(pokemonId, nickname, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(pokemonId, { gameId });
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('modifyMoves', () => {
    let getPokemonSpy: jest.SpyInstance;
    let getAllMoveOfAllEvolutionSpy: jest.SpyInstance;
    beforeEach(() => {
      getPokemonSpy = jest.spyOn(pokemonRepository, 'get');
      getAllMoveOfAllEvolutionSpy = jest.spyOn(
        moveLearningService,
        'getMovesOfAllEvolutions',
      );
    });
    it('should modify the moves of a pokemon if the trainerId matches and all moves are learnable', async () => {
      const pokemonId = 'pokemonId';
      const trainerId = 'trainerId';
      const gameId = 'gameId';
      const movesId = ['move1', 'move2'];
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId,
        basePokemon: { id: 1 },
        level: 10,
        moves: [],
      } as IPokemon;

      const allMovesLearnings = [
        { moveId: 'move1' },
        { moveId: 'move2' },
      ] as any;

      getPokemonSpy.mockResolvedValue(pokemon);
      getAllMoveOfAllEvolutionSpy.mockResolvedValue(allMovesLearnings);
      jest.spyOn(service, 'update').mockResolvedValue(pokemon);

      await service.modifyMoves(pokemonId, movesId, trainerId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(pokemonId, { gameId });
      expect(getAllMoveOfAllEvolutionSpy).toHaveBeenCalledWith(1, 10);
      expect(pokemon.moves).toEqual(movesId as unknown as IMove[]);
      expect(service.update).toHaveBeenCalledWith(pokemonId, pokemon);
    });

    it('should not modify the moves if the trainerId does not match', async () => {
      const pokemonId = 'pokemonId';
      const trainerId = 'trainerId';
      const gameId = 'gameId';
      const movesId = ['move1', 'move2'];
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId: 'differentTrainerId',
        basePokemon: { id: 1 },
        level: 10,
        moves: [],
      } as IPokemon;

      getPokemonSpy.mockResolvedValue(pokemon);

      const updateSpy = jest.spyOn(service, 'update');

      await service.modifyMoves(pokemonId, movesId, trainerId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(pokemonId, { gameId });
      expect(getAllMoveOfAllEvolutionSpy).not.toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should not modify the moves if not all moves are learnable', async () => {
      const pokemonId = 'pokemonId';
      const trainerId = 'trainerId';
      const gameId = 'gameId';
      const movesId = ['move1', 'move2'];
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId,
        basePokemon: { id: 1 },
        level: 10,
        moves: [],
      } as IPokemon;

      const allMovesLearnings = [{ moveId: 'move1' }] as any; // only one move is learnable

      getPokemonSpy.mockResolvedValue(pokemon);
      getAllMoveOfAllEvolutionSpy.mockResolvedValue(allMovesLearnings);

      const updateSpy = jest.spyOn(service, 'update');

      await service.modifyMoves(pokemonId, movesId, trainerId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(pokemonId, { gameId });
      expect(getAllMoveOfAllEvolutionSpy).toHaveBeenCalledWith(1, 10);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
  describe('modifyMoveStrategy', () => {
    let listPokemonSpy: jest.SpyInstance;

    beforeEach(() => {
      listPokemonSpy = jest.spyOn(pokemonRepository, 'list');
    });
    it('should modify the strategy of a pokemon if the trainerId matches', async () => {
      const pokemonId = 'pokemonId';
      const strategy = [1, 2, 3];
      const gameId = 'gameId';
      const trainerId = 'trainerId';
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId,
        strategy: [],
      } as IPokemon;

      listPokemonSpy.mockResolvedValue([pokemon]);
      jest.spyOn(service, 'updateMany').mockResolvedValue([pokemon]);

      await service.modifyMoveStrategy(
        [{ pokemonId, strategy }],
        trainerId,
        gameId,
      );

      expect(listPokemonSpy).toHaveBeenCalledWith(
        { ids: [pokemonId] },
        { gameId },
      );
      expect(pokemon.strategy).toEqual(strategy);
      expect(service.updateMany).toHaveBeenCalledWith([pokemon], gameId);
    });

    it('should not modify the strategy if the trainerId does not match', async () => {
      const pokemonId = 'pokemonId';
      const strategy = [1, 2, 3];
      const gameId = 'gameId';
      const trainerId = 'trainerId';
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId: 'differentTrainerId',
        strategy: [],
      } as IPokemon;
      jest.spyOn(service, 'updateMany');

      listPokemonSpy.mockResolvedValue([pokemon]);

      await service.modifyMoveStrategy(
        [{ pokemonId, strategy }],
        trainerId,
        gameId,
      );

      expect(listPokemonSpy).toHaveBeenCalledWith(
        { ids: [pokemonId] },
        { gameId },
      );
      expect(pokemon.strategy).not.toEqual(strategy);
      expect(service.updateMany).not.toHaveBeenCalled();
    });

    it('should not modify the strategy if the pokemon is not found', async () => {
      const pokemonId = 'pokemonId';
      const strategy = [1, 2, 3];
      const gameId = 'gameId';
      const trainerId = 'trainerId';

      listPokemonSpy.mockResolvedValue([]);
      jest.spyOn(service, 'updateMany');

      await service.modifyMoveStrategy(
        [{ pokemonId, strategy }],
        trainerId,
        gameId,
      );

      expect(listPokemonSpy).toHaveBeenCalledWith(
        { ids: [pokemonId] },
        { gameId },
      );
      expect(service.updateMany).not.toHaveBeenCalled();
    });
  });
  describe('modifyBattleMoveStrategy', () => {
    let listPokemonSpy: jest.SpyInstance;

    beforeEach(() => {
      listPokemonSpy = jest.spyOn(pokemonRepository, 'list');
    });
    it('should modify the strategy of a pokemon if the trainerId matches', async () => {
      const pokemonId = 'pokemonId';
      const strategy = [1, 2, 3];
      const gameId = 'gameId';
      const trainerId = 'trainerId';
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId,
        strategy: [],
      } as IPokemon;

      listPokemonSpy.mockResolvedValue([pokemon]);
      jest.spyOn(service, 'updateMany').mockResolvedValue([pokemon]);

      await service.modifyBattleMoveStrategy(
        [{ pokemonId, strategy }],
        trainerId,
        gameId,
      );

      expect(listPokemonSpy).toHaveBeenCalledWith(
        { ids: [pokemonId] },
        { gameId },
      );
      expect(pokemon.battleStrategy).toEqual(strategy);
      expect(service.updateMany).toHaveBeenCalledWith([pokemon], gameId);
    });

    it('should not modify the strategy if the trainerId does not match', async () => {
      const pokemonId = 'pokemonId';
      const strategy = [1, 2, 3];
      const gameId = 'gameId';
      const trainerId = 'trainerId';
      const pokemon: IPokemon = {
        _id: pokemonId,
        gameId,
        trainerId: 'differentTrainerId',
        strategy: [],
      } as IPokemon;
      jest.spyOn(service, 'updateMany');

      listPokemonSpy.mockResolvedValue([pokemon]);

      await service.modifyBattleMoveStrategy(
        [{ pokemonId, strategy }],
        trainerId,
        gameId,
      );

      expect(listPokemonSpy).toHaveBeenCalledWith(
        { ids: [pokemonId] },
        { gameId },
      );
      expect(pokemon.battleStrategy).not.toEqual(strategy);
      expect(service.updateMany).not.toHaveBeenCalled();
    });

    it('should not modify the strategy if the pokemon is not found', async () => {
      const pokemonId = 'pokemonId';
      const strategy = [1, 2, 3];
      const gameId = 'gameId';
      const trainerId = 'trainerId';

      listPokemonSpy.mockResolvedValue([]);
      jest.spyOn(service, 'updateMany');

      await service.modifyBattleMoveStrategy(
        [{ pokemonId, strategy }],
        trainerId,
        gameId,
      );

      expect(listPokemonSpy).toHaveBeenCalledWith(
        { ids: [pokemonId] },
        { gameId },
      );
      expect(service.updateMany).not.toHaveBeenCalled();
    });
  });
  describe('hatchEgg', () => {
    let getPokemonSpy: jest.SpyInstance;
    let getGameSpy: jest.SpyInstance;

    beforeEach(() => {
      getPokemonSpy = jest.spyOn(pokemonRepository, 'get');
      getGameSpy = jest.spyOn(gameRepository, 'get');
    });
    it('should hatch the egg if the conditions are met', async () => {
      const eggId = 'eggId';
      const gameId = 'gameId';
      const actualDate = new Date();
      const pokemon: IPokemon = {
        _id: eggId,
        gameId,
        hatchingDate: actualDate,
        level: 0,
      } as IPokemon;
      const game: IGame = { _id: gameId, actualDate } as IGame;

      getPokemonSpy.mockResolvedValue(pokemon);
      getGameSpy.mockResolvedValue(game);
      jest.spyOn(service, 'update').mockResolvedValue(pokemon);

      await service.hatchEgg(eggId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(eggId, { gameId });
      expect(getGameSpy).toHaveBeenCalledWith(gameId);
      expect(pokemon.level).toBe(1);
      expect(pokemon.hatchingDate).toBeNull();
      expect(service.update).toHaveBeenCalledWith(eggId, pokemon);
    });

    it('should not hatch the egg if the game is not found', async () => {
      const eggId = 'eggId';
      const gameId = 'gameId';
      const pokemon: IPokemon = {
        _id: eggId,
        gameId,
        hatchingDate: new Date(),
        level: 0,
      } as IPokemon;
      jest.spyOn(service, 'update');
      getPokemonSpy.mockResolvedValue(pokemon);
      getGameSpy.mockResolvedValue(null);

      await service.hatchEgg(eggId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(eggId, { gameId });
      expect(getGameSpy).toHaveBeenCalledWith(gameId);
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should not hatch the egg if the pokemon is not found', async () => {
      const eggId = 'eggId';
      const gameId = 'gameId';
      const actualDate = new Date();
      const game: IGame = { _id: gameId, actualDate } as IGame;
      jest.spyOn(service, 'update');
      getPokemonSpy.mockResolvedValue(null);
      getGameSpy.mockResolvedValue(game);

      await service.hatchEgg(eggId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(eggId, { gameId });
      expect(getGameSpy).toHaveBeenCalledWith(gameId);
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should not hatch the egg if the conditions are not met', async () => {
      const eggId = 'eggId';
      const gameId = 'gameId';
      const actualDate = new Date();
      const pokemon: IPokemon = {
        _id: eggId,
        gameId,
        hatchingDate: new Date(actualDate.getTime() + 1), // Different date
        level: 0,
      } as IPokemon;
      const game: IGame = { _id: gameId, actualDate } as IGame;
      jest.spyOn(service, 'update');
      getPokemonSpy.mockResolvedValue(pokemon);
      getGameSpy.mockResolvedValue(game);

      await service.hatchEgg(eggId, gameId);

      expect(getPokemonSpy).toHaveBeenCalledWith(eggId, { gameId });
      expect(getGameSpy).toHaveBeenCalledWith(gameId);
      expect(service.update).not.toHaveBeenCalled();
    });
  });
});
