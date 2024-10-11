import { container } from "tsyringe";
import { NewSeasonService } from "./NewSeasonService";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import CompetitionService from "../competition/CompetitionService";
import GenerateCalendarService from "./GenerateCalendarService";
import CompetitionRepository from "../../domain/competiton/CompetitionRepository";
import {
  BattleInstanceService,
  IRankingBase,
  ITrainerRanking,
} from "../battleInstance/BattleInstanceService";
import CompetitionHistoryRepository from "../../domain/competiton/competitionHistory/CompetitionHistoryRepository";
import { IGame } from "../../domain/game/Game";
import {
  CompetitionType,
  ICompetition,
} from "../../domain/competiton/Competition";
import { TrainerTestMother } from "../../test/domain/Trainer/TrainerTestMother";
import {
  IGroupsCompetitionHistory,
  ITournamentCompetitionHistory,
} from "../../domain/competiton/competitionHistory/CompetitionHistory";

describe("NewSeasonService", () => {
  let service: NewSeasonService;
  let pokemonRepository: PokemonRepository;
  let trainerRepository: TrainerRepository;
  let trainerService: TrainerService;
  let competitionService: CompetitionService;
  let generateCalendarService: GenerateCalendarService;
  let competitionRepository: CompetitionRepository;
  let battleInstanceService: BattleInstanceService;
  let competitionHistoryRepository: CompetitionHistoryRepository;

  beforeEach(() => {
    service = container.resolve(NewSeasonService);
    pokemonRepository = container.resolve(PokemonRepository);
    trainerRepository = container.resolve(TrainerRepository);
    trainerService = container.resolve(TrainerService);
    competitionService = container.resolve(CompetitionService);
    generateCalendarService = container.resolve(GenerateCalendarService);
    competitionRepository = container.resolve(CompetitionRepository);
    battleInstanceService = container.resolve(BattleInstanceService);
    competitionHistoryRepository = container.resolve(
      CompetitionHistoryRepository,
    );

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("newSeason method", () => {
    it("should archive competitions, compute promotions/relegations, and generate trainers", async () => {
      const game: IGame = { _id: "gameId", actualDate: new Date() } as IGame;
      const competitionHistory = [{}] as any; // Simulating competition history

      jest
        .spyOn(service, "archiveCurrentCompetition")
        .mockResolvedValue(competitionHistory);
      jest.spyOn(service, "computePromotionAndRelegation").mockResolvedValue();
      jest.spyOn(pokemonRepository, "archiveOldPokemon").mockResolvedValue();
      jest
        .spyOn(trainerRepository, "list")
        .mockResolvedValue([TrainerTestMother.strongTrainer()]);
      jest.spyOn(trainerRepository, "deleteTrainer").mockResolvedValue(null);
      jest
        .spyOn(competitionService, "createChampionship")
        .mockResolvedValue({} as ICompetition);
      jest
        .spyOn(trainerService, "generateTrainerWithPokemonByDivision")
        .mockResolvedValue();
      jest.spyOn(trainerService, "updateMany").mockResolvedValue(null);
      jest
        .spyOn(generateCalendarService, "generateChampionships")
        .mockResolvedValue();

      await service.newSeason(game);

      expect(service.archiveCurrentCompetition).toHaveBeenCalledWith(game);
      expect(service.computePromotionAndRelegation).toHaveBeenCalledWith(
        competitionHistory,
        game._id,
      );
      expect(pokemonRepository.archiveOldPokemon).toHaveBeenCalledWith(game);
      expect(trainerRepository.list).toHaveBeenCalled();
      expect(
        trainerService.generateTrainerWithPokemonByDivision,
      ).toHaveBeenCalled();
      expect(trainerService.updateMany).toHaveBeenCalled();
      expect(generateCalendarService.generateChampionships).toHaveBeenCalled();
    });
  });

  describe("archiveCurrentCompetition method", () => {
    it("should archive current competitions and save history", async () => {
      const game: IGame = { _id: "gameId", actualDate: new Date() } as IGame;
      const competitions = [
        { _id: "compId", type: CompetitionType.CHAMPIONSHIP },
      ] as ICompetition[];
      const competitionHistoryArray = [{ _id: "historyId" }] as any;

      jest.spyOn(competitionRepository, "list").mockResolvedValue(competitions);
      jest
        .spyOn(battleInstanceService, "getChampionshipRanking")
        .mockResolvedValue([]);
      jest
        .spyOn(competitionHistoryRepository, "insertMany")
        .mockResolvedValue(competitionHistoryArray);
      jest.spyOn(competitionRepository, "archiveMany").mockResolvedValue();

      const result = await service.archiveCurrentCompetition(game);

      expect(competitionRepository.list).toHaveBeenCalled();
      expect(battleInstanceService.getChampionshipRanking).toHaveBeenCalled();
      expect(competitionHistoryRepository.insertMany).toHaveBeenCalled();
      expect(competitionRepository.archiveMany).toHaveBeenCalled();
      expect(result).toEqual(competitionHistoryArray);
    });
  });

  describe("computePromotionAndRelegation method", () => {
    it("should compute promotion and relegation based on competition history", async () => {
      const competitionHistory = [
        { type: CompetitionType.GROUPS, division: 2 } as any,
        { type: CompetitionType.TOURNAMENT, division: 3 } as any,
      ];
      const gameId = "gameId";

      jest.spyOn(service, "computePromotion").mockResolvedValue();
      jest.spyOn(service, "computeRelegation").mockResolvedValue();

      await service.computePromotionAndRelegation(competitionHistory, gameId);

      expect(service.computePromotion).toHaveBeenCalledWith(
        [competitionHistory[1]],
        gameId,
      );
      expect(service.computeRelegation).toHaveBeenCalledWith(
        [competitionHistory[0]],
        gameId,
      );
    });
  });

  describe("computePromotion method", () => {
    beforeEach(() => {
      jest.spyOn(trainerRepository, "promote").mockResolvedValue();
    });
    it("should promote trainers from tournaments", async () => {
      const tournamentHistory: ITournamentCompetitionHistory[] = [
        {
          division: 1,
          tournament: [
            [
              {
                winner: "trainerFromDivision1",
                player: {} as IRankingBase,
                opponent: {} as IRankingBase,
              },
            ],
            [],
            [],
          ],
        } as ITournamentCompetitionHistory,
        {
          division: 2,
          tournament: [
            [
              {
                winner: "trainerFromDivision2",
                player: {} as IRankingBase,
                opponent: {} as IRankingBase,
              },
            ],
            [],
            [],
          ],
        } as ITournamentCompetitionHistory,
        {
          division: 3,
          tournament: [
            [
              {
                winner: "trainerFromDivision3",
                player: {} as IRankingBase,
                opponent: {} as IRankingBase,
              },
            ],
            [],
            [],
          ],
        } as ITournamentCompetitionHistory,
      ];
      const gameId = "gameId";

      await service.computePromotion(tournamentHistory, gameId);

      expect(trainerRepository.promote).toHaveBeenCalledWith(
        ["trainerFromDivision2", "trainerFromDivision3"],
        gameId,
      );
    });

    it("should do nothing with only one division", async () => {
      const tournamentHistory = [
        { division: 3, tournament: [{ winner: "trainerId" }] } as any,
      ];
      const gameId = "gameId";

      jest.spyOn(trainerRepository, "promote").mockResolvedValue();

      await service.computePromotion(tournamentHistory, gameId);

      expect(trainerRepository.promote).not.toHaveBeenCalled();
    });
  });

  describe("computeRelegation method", () => {
    beforeEach(() => {
      jest.spyOn(trainerRepository, "relegate").mockResolvedValue();
    });
    it("should relegate trainers from groups", async () => {
      const groupHistory: IGroupsCompetitionHistory[] = [
        {
          division: 1,
          groups: [
            [
              { ranking: 1, _id: "1fromDiv1-1" } as ITrainerRanking,
              { ranking: 2, _id: "2fromDiv1-1" } as ITrainerRanking,
              { ranking: 3, _id: "3fromDiv1-1" } as ITrainerRanking,
              { ranking: 4, _id: "4fromDiv1-1" } as ITrainerRanking,
            ],
            [
              { ranking: 1, _id: "1fromDiv1-2" } as ITrainerRanking,
              { ranking: 2, _id: "2fromDiv1-2" } as ITrainerRanking,
              { ranking: 3, _id: "3fromDiv1-2" } as ITrainerRanking,
              { ranking: 4, _id: "4fromDiv1-2" } as ITrainerRanking,
            ],
          ],
        } as IGroupsCompetitionHistory,
        {
          division: 2,
          groups: [
            [
              { ranking: 1, _id: "1fromDiv2-1" } as ITrainerRanking,
              { ranking: 2, _id: "2fromDiv2-1" } as ITrainerRanking,
              { ranking: 3, _id: "3fromDiv2-1" } as ITrainerRanking,
              { ranking: 4, _id: "4fromDiv2-1" } as ITrainerRanking,
            ],
            [
              { ranking: 1, _id: "1fromDiv2-2" } as ITrainerRanking,
              { ranking: 2, _id: "2fromDiv2-2" } as ITrainerRanking,
              { ranking: 3, _id: "3fromDiv2-2" } as ITrainerRanking,
              { ranking: 4, _id: "4fromDiv2-2" } as ITrainerRanking,
            ],
          ],
        } as IGroupsCompetitionHistory,
        {
          division: 3,
          groups: [
            [
              { ranking: 1, _id: "1fromDiv3-1" } as ITrainerRanking,
              { ranking: 2, _id: "2fromDiv3-1" } as ITrainerRanking,
              { ranking: 3, _id: "3fromDiv3-1" } as ITrainerRanking,
              { ranking: 4, _id: "4fromDiv3-1" } as ITrainerRanking,
            ],
            [
              { ranking: 1, _id: "1fromDiv3-2" } as ITrainerRanking,
              { ranking: 2, _id: "2fromDiv3-2" } as ITrainerRanking,
              { ranking: 3, _id: "3fromDiv3-2" } as ITrainerRanking,
              { ranking: 4, _id: "4fromDiv3-2" } as ITrainerRanking,
            ],
          ],
        } as IGroupsCompetitionHistory,
      ];
      const gameId = "gameId";

      await service.computeRelegation(groupHistory, gameId);

      expect(trainerRepository.relegate).toHaveBeenCalledWith(
        [
          "3fromDiv1-1",
          "4fromDiv1-1",
          "3fromDiv1-2",
          "4fromDiv1-2",
          "3fromDiv2-1",
          "4fromDiv2-1",
          "3fromDiv2-2",
          "4fromDiv2-2",
        ],
        gameId,
      );
    });

    it("should do nothing with only one division", async () => {
      const groupHistory = [
        { division: 1, groups: [{ ranking: 2, _id: "trainerId" }] } as any,
      ];
      const gameId = "gameId";

      await service.computeRelegation(groupHistory, gameId);

      expect(trainerRepository.relegate).not.toHaveBeenCalled();
    });
  });
});
