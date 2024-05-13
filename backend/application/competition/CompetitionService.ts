import { singleton } from "tsyringe";
import CompetitionRepository from "../../domain/competiton/CompetitionRepository";
import {
  CompetitionType,
  ICompetition,
} from "../../domain/competiton/Competition";
import { IGame } from "../../domain/game/Game";
import { BattleInstanceService } from "../battleInstance/BattleInstanceService";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TournamentService from "./tournament/TournamentService";
import { ITrainer } from "../../domain/trainer/Trainer";
import { addDays } from "../../utils/DateUtils";
import { mongoId } from "../../utils/MongoUtils";
import GenerateCalendarService from "../calendarEvent/GenerateCalendarService";

@singleton()
export default class CompetitionService {
  constructor(
    private competitionRepository: CompetitionRepository,
    private battleInstanceService: BattleInstanceService,
    private trainerRepository: TrainerRepository,
    private tournamentService: TournamentService,
    private generateCalendarService: GenerateCalendarService,
  ) {}

  public async createFriendly(gameId: string): Promise<ICompetition> {
    return await this.competitionRepository.create({
      gameId,
      name: "FRIENDLY",
      type: CompetitionType.FRIENDLY,
    });
  }

  public async createChampionship(game: IGame): Promise<ICompetition> {
    const startDate = new Date(game.actualDate);
    const endDate = new Date(game.actualDate);
    startDate.setUTCDate(startDate.getUTCDate() + 1);
    endDate.setUTCMonth(endDate.getUTCMonth() + 8);
    return await this.competitionRepository.create({
      gameId: game._id.toString(),
      name: "CHAMPIONSHIP",
      type: CompetitionType.CHAMPIONSHIP,
      endDate,
      startDate,
    });
  }

  public async createTournament(
    gameId: string,
    name: string,
    trainers: ITrainer[],
    startDate: Date,
    division: number,
  ): Promise<ICompetition> {
    const competitionId = mongoId();

    const competition = await this.competitionRepository.create({
      _id: competitionId,
      gameId,
      name,
      startDate,
      division,
      type: CompetitionType.TOURNAMENT,
      tournament: await this.tournamentService.createTournament(
        trainers,
        3,
        startDate,
        gameId,
        competitionId,
      ),
    });
    for (const trainer of trainers) {
      trainer.competitions.unshift(competition);
      await this.trainerRepository.update(trainer._id, trainer);
    }
    return competition;
  }

  public async championshipEnd(
    gameId: string,
    actualDate: Date,
  ): Promise<void> {
    const endedChampionships = await this.competitionRepository.list({
      custom: {
        gameId,
        endDate: actualDate,
        type: CompetitionType.CHAMPIONSHIP,
      },
    });
    for (const championship of endedChampionships) {
      const ranking = await this.battleInstanceService.getChampionshipRanking(
        championship._id.toString(),
      );
      const qualifiedPlayersId = ranking.slice(0, 8).map((value) => value._id);
      const qualifiedTrainers = await this.trainerRepository.list({
        ids: qualifiedPlayersId,
      });
      await this.createTournament(
        gameId,
        "PLAYOFF",
        qualifiedTrainers,
        addDays(actualDate, 14),
        3,
      );
      const groupsTrainerIds = ranking.slice(8, 21).map((value) => value._id);
      const groupsTrainers = await this.trainerRepository.list({
        ids: groupsTrainerIds,
      });
      await this.createGroupsCompetition(
        gameId,
        "RELEGATION_GROUPS",
        groupsTrainers,
        3,
        addDays(actualDate, 7),
        addDays(actualDate, 49),
      );
    }
  }

  private async createGroupsCompetition(
    gameId: string,
    name: string,
    trainers: ITrainer[],
    division: number,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const groups = this.splitArray(trainers);
    const competition = await this.competitionRepository.create({
      gameId,
      groups,
      type: CompetitionType.GROUPS,
      name,
      division,
      startDate,
      endDate,
    });
    trainers.map((trainer) => {
      trainer.competitions.unshift(competition);
      return trainer;
    });
    await this.trainerRepository.updateMany(trainers);
    await this.generateCalendarService.generateGroupMatches(
      groups,
      3,
      gameId,
      competition,
    );
  }

  private splitArray<T>(inputArray: T[]): T[][] {
    const array1: T[] = [];
    const array2: T[] = [];

    inputArray.forEach((element, index) => {
      const position = Math.floor(index / 3);
      const phase = index % 3;

      if (position % 2 === 0 && phase !== 2) {
        array1.push(element);
      } else if (position % 2 !== 0 && phase === 2) {
        array1.push(element);
      } else {
        array2.push(element);
      }
    });

    return [array1, array2];
  }
}
