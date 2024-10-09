import { singleton } from "tsyringe";
import { IGame } from "../../domain/game/Game";
import {
  ICompetitionHistory,
  IGroupsCompetitionHistory,
  ITournamentCompetitionHistory,
} from "../../domain/competiton/competitionHistory/CompetitionHistory";
import {
  CompetitionType,
  ICompetition,
} from "../../domain/competiton/Competition";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import CompetitionService from "../competition/CompetitionService";
import GenerateCalendarService from "./GenerateCalendarService";
import CompetitionRepository from "../../domain/competiton/CompetitionRepository";
import { BattleInstanceService } from "../battleInstance/BattleInstanceService";
import CompetitionHistoryRepository from "../../domain/competiton/competitionHistory/CompetitionHistoryRepository";
import { ITrainer } from "../../domain/trainer/Trainer";
import { NB_DIVISION } from "../game/GameConst";

@singleton()
export class NewSeasonService {
  constructor(
    private readonly pokemonRepository: PokemonRepository,
    private readonly trainerRepository: TrainerRepository,
    private readonly trainerService: TrainerService,
    private readonly competitionService: CompetitionService,
    private readonly generateCalendarService: GenerateCalendarService,
    private readonly competitionRepository: CompetitionRepository,
    private readonly battleInstanceService: BattleInstanceService,
    private readonly competitionHistoryRepository: CompetitionHistoryRepository,
  ) {}

  public async newSeason(game: IGame): Promise<void> {
    const savedCompetitionHistoryArray =
      await this.archiveCurrentCompetition(game);
    await this.computePromotionAndRelegation(
      savedCompetitionHistoryArray,
      game._id,
    );
    await this.pokemonRepository.archiveOldPokemon(game);

    const noPokemonTrainers = await this.trainerRepository.list({
      custom: { gameId: game._id, pokemons: { $size: 0 } },
    });
    const nbTrainersToGenerateByDivision: number[] = [0, 0, 0];
    noPokemonTrainers.forEach((trainer) => {
      nbTrainersToGenerateByDivision[trainer.division - 1] += 1;
    });
    for (const trainer of noPokemonTrainers) {
      await this.trainerRepository.deleteTrainer(trainer);
    }

    const championships: ICompetition[] = [];
    for (let i = 1; i <= NB_DIVISION; i++) {
      championships.push(
        await this.competitionService.createChampionship(game, i),
      );
    }

    await this.trainerService.generateTrainerWithPokemonByDivision(
      game,
      nbTrainersToGenerateByDivision,
      championships,
    );

    // await this.trainerService.generateTrainerWithPokemon(
    //   game,
    //   noPokemonTrainers.length,
    // );
    // const championship = await this.competitionService.createChampionship(
    //   game,
    //   3,
    // );
    const trainers = await this.trainerRepository.list(
      {},
      { gameId: game._id },
    );
    const trainersByDivision: ITrainer[][] =
      this.trainerService.getTrainersByDivision(trainers);

    trainers.map((trainer) => {
      trainer.competitions.push(championships[trainer.division - 1]);
      return trainer;
    });

    await this.trainerService.updateMany(trainers);
    await this.generateCalendarService.generateChampionships(
      trainersByDivision,
      3,
      game._id,
      championships,
    );
  }

  private async archiveCurrentCompetition(
    game: IGame,
  ): Promise<ICompetitionHistory[]> {
    const year = game.actualDate.getUTCFullYear() - 1;
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year + 1}-01-01T00:00:00.000Z`);
    const competitions = await this.competitionRepository.list({
      custom: {
        gameId: game._id.toString(),
        startDate: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    });
    const competitionHistoryArray: ICompetitionHistory[] = [];
    for (const competition of competitions) {
      const competitionHistory: ICompetitionHistory = {
        season: year,
        gameId: game._id,
        type: competition.type,
        name: competition.name,
        division: competition.division,
      } as ICompetitionHistory;
      if (
        competitionHistory.type === CompetitionType.TOURNAMENT &&
        competition.type === CompetitionType.TOURNAMENT
      ) {
        competitionHistory.tournament = (
          await this.battleInstanceService.getTournamentRanking(
            competition.tournament._id,
          )
        ).tournamentRanking;
      } else if (competitionHistory.type === CompetitionType.CHAMPIONSHIP) {
        competitionHistory.ranking =
          await this.battleInstanceService.getChampionshipRanking(
            competition._id,
          );
      } else if (competitionHistory.type === CompetitionType.GROUPS) {
        competitionHistory.groups =
          await this.battleInstanceService.getGroupsRanking(competition._id);
      }
      competitionHistoryArray.push(competitionHistory);
    }
    const savedCompetitionHistoryArray =
      await this.competitionHistoryRepository.insertMany(
        competitionHistoryArray,
      );
    await this.competitionRepository.archiveMany(
      competitions.map((competition) => competition._id),
    );
    return savedCompetitionHistoryArray;
  }

  private async computePromotionAndRelegation(
    competitionHistoryArray: ICompetitionHistory[],
    gameId: string,
  ): Promise<void> {
    const groupsCompetition: IGroupsCompetitionHistory[] =
      competitionHistoryArray.filter(
        (competition) => competition.type === CompetitionType.GROUPS,
      ) as IGroupsCompetitionHistory[];
    const tournamentCompetition: ITournamentCompetitionHistory[] =
      competitionHistoryArray.filter(
        (competition) => competition.type === CompetitionType.TOURNAMENT,
      ) as ITournamentCompetitionHistory[];
    await this.computeRelegation(groupsCompetition, gameId);
    await this.computePromotion(tournamentCompetition, gameId);
  }

  private async computePromotion(
    tournamentCompetitionHistories: ITournamentCompetitionHistory[],
    gameId: string,
  ): Promise<void> {
    if (tournamentCompetitionHistories.length <= 1) {
      return;
    }
    let promotedTrainerIds: string[] = [];
    tournamentCompetitionHistories.forEach((competition) => {
      if (competition.division !== 1 && competition.division !== undefined) {
        promotedTrainerIds = [
          ...promotedTrainerIds,
          ...competition.tournament[competition.tournament.length - 3].map(
            (serie) => serie.winner,
          ),
        ];
      }
    });
    await this.trainerRepository.promote(promotedTrainerIds, gameId);
  }

  private async computeRelegation(
    groupsCompetitionHistories: IGroupsCompetitionHistory[],
    gameId: string,
  ): Promise<void> {
    if (groupsCompetitionHistories.length <= 1) {
      return;
    }
    let relegatedTrainerIds: string[] = [];
    groupsCompetitionHistories.forEach((competition) => {
      if (
        competition.division !== NB_DIVISION &&
        competition.division !== undefined
      ) {
        competition.groups.forEach((group) => {
          relegatedTrainerIds = [
            ...relegatedTrainerIds,
            ...group
              .filter((value) => value.ranking >= group.length - 1)
              .map((ranking) => ranking._id),
          ];
        });
      }
    });
    await this.trainerRepository.relegate(relegatedTrainerIds, gameId);
  }
}
