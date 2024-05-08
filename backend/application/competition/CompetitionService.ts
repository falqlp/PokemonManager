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
import { ObjectId } from "mongodb";
import { addDays } from "../../utils/DateUtils";

@singleton()
export default class CompetitionService {
  constructor(
    protected competitionRepository: CompetitionRepository,
    protected battleInstanceService: BattleInstanceService,
    protected trainerRepository: TrainerRepository,
    protected tournamentService: TournamentService,
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
    endDate.setUTCMonth(endDate.getUTCMonth() + 6);
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
  ): Promise<ICompetition> {
    const competitionId = new ObjectId() as unknown as string;

    const competition = await this.competitionRepository.create({
      _id: competitionId,
      gameId,
      name,
      startDate,
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
        addDays(actualDate, 1),
      );
    }
  }
}
