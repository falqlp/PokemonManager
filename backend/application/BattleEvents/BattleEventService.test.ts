import { container } from "tsyringe";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import DamageEventRepository from "../../domain/battleevents/damageevent/DamageEventRepository";
import BattleParticipationEventRepository from "../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository";
import {
  BattleEventQueryType,
  BattleEventsService,
} from "./BattleEventsService";
import { IDamageEvent } from "../../domain/battleevents/damageevent/DamageEvent";
import { IBattleParticipationEvent } from "../../domain/battleevents/battleparticipationevent/BattleParticipationEvent";
import { DamageEventTestMother } from "../../test/domain/BattleEvents/DamageEventTestMother";
import { BattleParticipationEventTestMother } from "../../test/domain/BattleEvents/BattleParticipationEventTestMother";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import CompetitionTestMother from "../../test/domain/competition/CompetitionTestMother";
import {
  IDamageEventQuery,
  IStatsByPokemon,
} from "../../domain/battleevents/BattleEventQueriesUtilService";
import { SortOrder } from "mongoose";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import { PokemonTestMother } from "../../test/domain/pokemon/PokemonTestMother";

describe("BattleEventsService", () => {
  let service: BattleEventsService;
  let calendarEventRepository: CalendarEventRepository;
  let battleInstanceRepository: BattleInstanceRepository;
  let damageEventRepository: DamageEventRepository;
  let battleParticipationEventRepository: BattleParticipationEventRepository;
  let pokemonRepository: PokemonRepository;

  beforeEach(() => {
    service = container.resolve(BattleEventsService);
    calendarEventRepository = container.resolve(CalendarEventRepository);
    battleInstanceRepository = container.resolve(BattleInstanceRepository);
    damageEventRepository = container.resolve(DamageEventRepository);
    battleParticipationEventRepository = container.resolve(
      BattleParticipationEventRepository,
    );
    pokemonRepository = container.resolve(PokemonRepository);
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("insertBattleEventsData", () => {
    it("should insert damage and participation events with correct data", async () => {
      const battleId = "battleId";
      const date = new Date();
      const gameId = "gameId";
      const competitionId = "competitionId";
      const damageEvents: IDamageEvent[] = [
        DamageEventTestMother.basicDamage(),
        DamageEventTestMother.withCustomOptions({ value: 75 }),
      ];
      const battleParticipationEvents: IBattleParticipationEvent[] = [
        BattleParticipationEventTestMother.basicParticipation(),
        BattleParticipationEventTestMother.basicParticipation(),
      ];
      const getBattleDateSpy = jest.spyOn(
        calendarEventRepository,
        "getBattleDate",
      );
      const battleInstanceRepositoryGetSpy = jest.spyOn(
        battleInstanceRepository,
        "get",
      );
      getBattleDateSpy.mockResolvedValue(date);
      battleInstanceRepositoryGetSpy.mockResolvedValue({
        gameId,
        competition: CompetitionTestMother.withCustomOptions({
          _id: competitionId,
        }),
      } as IBattleInstance);
      jest.spyOn(damageEventRepository, "insertMany").mockResolvedValue([]);
      jest
        .spyOn(battleParticipationEventRepository, "insertMany")
        .mockResolvedValue([]);

      await service.insertBattleEventsData(
        battleId,
        damageEvents,
        battleParticipationEvents,
      );

      expect(getBattleDateSpy).toHaveBeenCalledWith(battleId);
      expect(battleInstanceRepositoryGetSpy).toHaveBeenCalledWith(battleId);
      expect(damageEventRepository.insertMany).toHaveBeenCalledWith([
        { ...damageEvents[0], battleId, competitionId, date, gameId },
        { ...damageEvents[1], battleId, competitionId, date, gameId },
      ]);
      expect(
        battleParticipationEventRepository.insertMany,
      ).toHaveBeenCalledWith([
        {
          ...battleParticipationEvents[0],
          battleId,
          competitionId,
          date,
          gameId,
        },
        {
          ...battleParticipationEvents[1],
          battleId,
          competitionId,
          date,
          gameId,
        },
      ]);
    });
  });
  describe("getRelativeResult", () => {
    it("should calculate relative results correctly", async () => {
      const gameId = "gameId";
      const query: IDamageEventQuery = {};
      const sort: SortOrder = 1;
      const res: IStatsByPokemon[] = [
        { _id: "pokemon1", value: 100 },
        { _id: "pokemon2", value: 100 },
      ];

      const participationEvents = [
        { _id: "pokemon1", value: 4 },
        { _id: "pokemon2", value: 2 },
      ];
      jest
        .spyOn(battleParticipationEventRepository, "getPaticipation")
        .mockResolvedValue(participationEvents);

      const result = await service.getRelativeResult(res, gameId, query, sort);

      expect(
        battleParticipationEventRepository.getPaticipation,
      ).toHaveBeenCalledWith(gameId, query, sort);
      expect(result).toEqual([
        { _id: "pokemon2", value: 50 },
        { _id: "pokemon1", value: 25 },
      ]);
    });
  });

  describe("getBattleEventStats", () => {
    it("should return stats for battle events", async () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE;
      const gameId = "gameId";
      const isRelative = false;
      const query: IDamageEventQuery = {};
      const sort: SortOrder = 1;
      const id1 = "pokemon1";
      const id2 = "pokemon2";
      const res: IStatsByPokemon[] = [
        { _id: id1, value: 100 },
        { _id: id2, value: 200 },
      ];
      const pokemons = [
        PokemonTestMother.withCustomOptions({ _id: id1 }),
        PokemonTestMother.withCustomOptions({ _id: id2 }),
      ];

      jest
        .spyOn(service, "getBattleEventQuery")
        .mockReturnValue(() => Promise.resolve(res));
      jest.spyOn(pokemonRepository, "list").mockResolvedValue(pokemons);

      const result = await service.getBattleEventStats(
        type,
        gameId,
        isRelative,
        query,
        sort,
      );

      expect(service.getBattleEventQuery).toHaveBeenCalledWith(type);
      expect(pokemonRepository.list).toHaveBeenCalledWith({
        ids: res.map((stats) => stats._id),
      });
      expect(result).toEqual([
        { value: 100, _id: id1, pokemon: pokemons[0] },
        { value: 200, _id: id2, pokemon: pokemons[1] },
      ]);
    });

    it("should throw an error if pokemons do not match", async () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE;
      const gameId = "gameId";
      const isRelative = false;
      const query: IDamageEventQuery = {};
      const sort: SortOrder = 1;
      const res: IStatsByPokemon[] = [
        { _id: "pokemon1", value: 100 },
        { _id: "pokemon2", value: 200 },
      ];
      const pokemons = [
        PokemonTestMother.generateArticuno(),
        PokemonTestMother.generateBulbasaur(),
      ];

      jest
        .spyOn(service, "getBattleEventQuery")
        .mockReturnValue(() => Promise.resolve(res));
      jest.spyOn(pokemonRepository, "list").mockResolvedValue(pokemons);

      await expect(
        service.getBattleEventStats(type, gameId, isRelative, query, sort),
      ).rejects.toThrow("Pokemons does not match");
    });
  });

  describe("getBattleEventQuery", () => {
    it("should return a query for TOTAL_DAMAGE type", () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalDamageReceived
          .bind(damageEventRepository)
          .toString(),
      );
    });
    it("should return a query for TOTAL_DAMAGE_RECEIVED type", () => {
      const type = BattleEventQueryType.TOTAL_DAMAGE_RECEIVED;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalDamageReceived
          .bind(damageEventRepository)
          .toString(),
      );
    });
    it("should return a query for TOTAL_KO type", () => {
      const type = BattleEventQueryType.TOTAL_KO;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalKo.bind(damageEventRepository).toString(),
      );
    });
    it("should return a query for TOTAL_KO_RECEIVED type", () => {
      const type = BattleEventQueryType.TOTAL_KO_RECEIVED;

      const result = service.getBattleEventQuery(type);

      expect(result).toBeDefined();
      expect(result.toString()).toBe(
        damageEventRepository.getTotalKoReceived
          .bind(damageEventRepository)
          .toString(),
      );
    });
    it("should return a query for BATTLE_PARTICIPATION type", () => {
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
