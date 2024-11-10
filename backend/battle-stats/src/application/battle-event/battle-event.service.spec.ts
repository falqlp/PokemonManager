import { Test, TestingModule } from '@nestjs/testing';
import { DamageEventTestMother } from 'shared/models/test/domain/BattleEvents/DamageEventTestMother';
import { BattleParticipationEventTestMother } from 'shared/models/test/domain/BattleEvents/BattleParticipationEventTestMother';
import { SortOrder } from 'mongoose';
import { PokemonTestMother } from 'shared/models/test/domain/pokemon/PokemonTestMother';
import DamageEventRepository from '../../domain/battleevents/damageevent/DamageEventRepository';
import BattleParticipationEventRepository from '../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository';
import ColorService from '../color/color.service';
import { IBattleParticipationEvent, IDamageEvent } from 'shared/models';
import {
  IDamageEventQuery,
  IStatsByPokemon,
} from '../../domain/battleevents/battle-event-queries-util.service';
import {
  BattleEventQueryType,
  BattleEventsBattleInstance,
  BattleEventService,
} from './battle-event.service';
import { CoreInterfaceService } from '../core-interface/core-interface.service';

jest.mock('../../domain/battleevents/damageevent/DamageEventRepository');
jest.mock(
  '../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository',
);
jest.mock('../color/color.service');
jest.mock('../core-interface/core-interface.service');

describe('BattleEventsService', () => {
  let service: BattleEventService;
  let damageEventRepository: jest.Mocked<DamageEventRepository>;
  let battleParticipationEventRepository: jest.Mocked<BattleParticipationEventRepository>;
  let colorService: jest.Mocked<ColorService>;
  let coreInterfaceService: jest.Mocked<CoreInterfaceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleEventService,
        DamageEventRepository,
        BattleParticipationEventRepository,
        ColorService,
        CoreInterfaceService,
      ],
    }).compile();

    service = module.get<BattleEventService>(BattleEventService);
    damageEventRepository = module.get(DamageEventRepository);
    battleParticipationEventRepository = module.get(
      BattleParticipationEventRepository,
    );
    colorService = module.get(ColorService);
    coreInterfaceService = module.get(CoreInterfaceService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertBattleEventsData', () => {
    it('should insert damage and participation events with correct data', async () => {
      const battleId = 'battleId';
      const date = new Date();
      const gameId = 'gameId';
      const competitionId = 'competitionId';
      const division = 1;
      const damageEvents: IDamageEvent[] = [
        DamageEventTestMother.basicDamage(),
        DamageEventTestMother.withCustomOptions({ value: 75 }),
      ];
      const battleParticipationEvents: IBattleParticipationEvent[] = [
        BattleParticipationEventTestMother.basicParticipation(),
        BattleParticipationEventTestMother.basicParticipation(),
      ];
      const battle: BattleEventsBattleInstance = {
        _id: battleId,
        gameId,
        competition: {
          _id: competitionId,
          division,
        },
      };
      damageEventRepository.insertMany.mockResolvedValue([]);
      battleParticipationEventRepository.insertMany.mockResolvedValue([]);

      await service.insertBattleEventsData(
        damageEvents,
        battleParticipationEvents,
        battle,
        date,
      );

      expect(
        battleParticipationEventRepository.insertMany,
      ).toHaveBeenCalledWith([
        {
          ...battleParticipationEvents[0],
          battleId,
          competitionId,
          date,
          gameId,
          division,
        },
        {
          ...battleParticipationEvents[1],
          battleId,
          competitionId,
          date,
          gameId,
          division,
        },
      ]);
    });
  });

  describe('getRelativeResult', () => {
    it('should calculate relative results correctly', async () => {
      const gameId = 'gameId';
      const query: IDamageEventQuery = {};
      const sort: SortOrder = -1;
      const res: IStatsByPokemon[] = [
        { _id: 'pokemon1', value: 100 },
        { _id: 'pokemon2', value: 100 },
        { _id: 'pokemon3', value: 200 },
      ];

      const participationEvents = [
        { _id: 'pokemon1', value: 4 },
        { _id: 'pokemon2', value: 2 },
        { _id: 'pokemon3', value: 2 },
      ];
      battleParticipationEventRepository.getPaticipation.mockResolvedValue(
        participationEvents,
      );

      const result = await service.getRelativeResult(res, gameId, query, sort);

      expect(
        battleParticipationEventRepository.getPaticipation,
      ).toHaveBeenCalledWith(gameId, query, sort);
      expect(result).toEqual([
        { _id: 'pokemon3', value: 100 },
        { _id: 'pokemon2', value: 50 },
        { _id: 'pokemon1', value: 25 },
      ]);
    });
  });

  describe('getBattleEventStats', () => {
    it('should return stats for battle events', async () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE;
      const gameId = 'gameId';
      const isRelative = false;
      const query: IDamageEventQuery = {};
      const sort: SortOrder = 1;
      const id1 = 'pokemon1';
      const id2 = 'pokemon2';
      const trainerId = 'trainerId';
      const trainer = [{ _id: trainerId, name: 'trainer', class: 'class' }];
      const res: IStatsByPokemon[] = [
        { _id: id1, value: 100 },
        { _id: id2, value: 200 },
      ];
      const pokemons = [
        PokemonTestMother.withCustomOptions({ _id: id1, trainerId }),
        PokemonTestMother.withCustomOptions({ _id: id2, trainerId }),
      ];

      jest
        .spyOn(service, 'getBattleEventQuery')
        .mockReturnValue(() => Promise.resolve(res));
      coreInterfaceService.getPokemonList.mockResolvedValue(pokemons);
      coreInterfaceService.getTrainerList.mockResolvedValue(trainer);
      colorService.getColorForTrainer.mockReturnValue('color');

      const result = await service.getBattleEventStats(
        gameId,
        type,
        isRelative,
        query,
        sort,
      );

      expect(service.getBattleEventQuery).toHaveBeenCalledWith(type);
      expect(coreInterfaceService.getPokemonList).toHaveBeenCalledWith(
        {
          ids: res.map((stats) => stats._id),
        },
        gameId,
      );
      expect(result).toEqual([
        {
          value: 100,
          _id: id1,
          pokemon: pokemons[0],
          trainer: {
            _id: trainerId,
            class: trainer[0].class,
            color: 'color',
            name: trainer[0].name,
          },
        },
        {
          value: 200,
          _id: id2,
          pokemon: pokemons[1],
          trainer: {
            _id: trainerId,
            class: trainer[0].class,
            color: 'color',
            name: trainer[0].name,
          },
        },
      ]);
    });

    it('should throw an error if pokemons do not match', async () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE;
      const gameId = 'gameId';
      const isRelative = false;
      const query: IDamageEventQuery = {};
      const sort: SortOrder = 1;
      const trainerId = 'trainerId';
      const res: IStatsByPokemon[] = [
        { _id: 'pokemon1', value: 100 },
        { _id: 'pokemon2', value: 200 },
      ];
      const pokemons = [
        PokemonTestMother.withCustomOptions({ trainerId }),
        PokemonTestMother.withCustomOptions({ trainerId }),
      ];

      jest
        .spyOn(service, 'getBattleEventQuery')
        .mockReturnValue(() => Promise.resolve(res));
      coreInterfaceService.getPokemonList.mockResolvedValue(pokemons);
      coreInterfaceService.getTrainerList.mockResolvedValue([
        { _id: trainerId, name: 'trainer', class: 'class' },
      ]);

      await expect(
        service.getBattleEventStats(gameId, type, isRelative, query, sort),
      ).rejects.toThrow('Pokemons does not match');
    });
  });

  describe('getBattleEventQuery', () => {
    it('should return a query for TOTAL_DAMAGE type', () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalDamageReceived
          .bind(damageEventRepository)
          .toString(),
      );
    });

    it('should return a query for TOTAL_DAMAGE_RECEIVED type', () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE_RECEIVED;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalDamageReceived
          .bind(damageEventRepository)
          .toString(),
      );
    });

    it('should return a query for TOTAL_KO type', () => {
      const type = BattleEventQueryType.TOTAL_KO;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalKo.bind(damageEventRepository).toString(),
      );
    });

    it('should return a query for TOTAL_KO_RECEIVED type', () => {
      const type = BattleEventQueryType.TOTAL_KO_RECEIVED;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalKoReceived
          .bind(damageEventRepository)
          .toString(),
      );
    });

    it('should return a query for BATTLE_PARTICIPATION type', () => {
      const type = BattleEventQueryType.BATTLE_PARTICIPATION;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        battleParticipationEventRepository.getPaticipation
          .bind(battleParticipationEventRepository)
          .toString(),
      );
    });
  });
});
