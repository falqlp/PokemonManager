import { singleton } from "tsyringe";
import TournamentRepository from "../../../domain/tournament/TournamentRepository";
import { ITrainer } from "../../../domain/trainer/Trainer";
import GenerateCalendarService from "../../calendarEvent/GenerateCalendarService";
import { addDays } from "../../../utils/DateUtils";
import {
  ITournament,
  ITournamentStep,
} from "../../../domain/tournament/Tournament";
import { IBattleInstance } from "../../../domain/battleInstance/Battle";
import { ICalendarEvent } from "../../../domain/calendarEvent/CalendarEvent";
import CalendarEventRepository from "../../../domain/calendarEvent/CalendarEventRepository";
import BattleInstanceRepository from "../../../domain/battleInstance/BattleInstanceRepository";
import BattleSerieRepository from "../../../domain/battleSerie/BattleSerieRepository";
import {
  IBattleSerie,
  SerieTypes,
} from "../../../domain/battleSerie/BattleSerie";
import { ObjectId } from "mongodb";
import { BattleInstanceService } from "../../battleInstance/BattleInstanceService";
import TrainerRepository from "../../../domain/trainer/TrainerRepository";
import { isPowerOfTwo } from "../../../utils/NumberUtils";

@singleton()
export default class TournamentService {
  constructor(
    protected tournamentRepository: TournamentRepository,
    protected generateCalendarService: GenerateCalendarService,
    protected calendarEventRepository: CalendarEventRepository,
    protected battleInstanceRepository: BattleInstanceRepository,
    protected battleSerieRepository: BattleSerieRepository,
    protected battleInstanceService: BattleInstanceService,
    protected trainerRepository: TrainerRepository,
  ) {}

  public async createTournament(
    trainers: ITrainer[],
    nbStep: number,
    startDate: Date,
    gameId: string,
    competitionId: string,
  ): Promise<ITournament> {
    if (!isPowerOfTwo(trainers.length)) {
      throw new Error("La taille du tournoi doit être une puissance de 2.");
    }
    const tournament: ITournament = {
      nbStep,
      tournamentSteps: [],
      gameId,
      competitionId,
    };
    tournament.tournamentSteps.push(
      await this.generateTournamentStep(
        trainers,
        startDate,
        gameId,
        competitionId,
        SerieTypes.BO3,
      ),
    );
    return this.tournamentRepository.create(tournament);
  }

  private async generateTournamentStep(
    trainers: ITrainer[],
    startDate: Date,
    gameId: string,
    competitionId: string,
    maxBattle: SerieTypes,
  ): Promise<ITournamentStep> {
    const endDate = addDays(startDate, 7);
    const tournamentStep: ITournamentStep = {
      startDate,
      endDate,
      battleSeries: [],
    };
    let battles: IBattleInstance[] = [];
    let events: ICalendarEvent[] = [];
    const battleSeries: IBattleSerie[] = [];
    const tournamentFirstStepPairs = this.generateTournamentPairs(trainers);
    tournamentFirstStepPairs.forEach((pair) => {
      const res = this.generateCalendarService.generateBO3matches(
        pair.player,
        pair.opponent,
        startDate,
        endDate,
        gameId,
        competitionId,
      );
      battles = [...battles, ...res.battles];
      events = [...events, ...res.events];
      const battleSerie: IBattleSerie = {
        _id: new ObjectId() as unknown as string,
        gameId,
        maxBattle,
        battles: res.battles,
        opponent: pair.opponent,
        player: pair.player,
      };
      battleSeries.push(battleSerie);
      tournamentStep.battleSeries.push(battleSerie);
    });
    await this.battleSerieRepository.insertMany(battleSeries);
    await this.battleInstanceRepository.insertMany(battles);
    await this.calendarEventRepository.insertMany(events);
    return tournamentStep;
  }

  public async addTournamentStep(
    trainers: ITrainer[],
    tournament: ITournament,
  ): Promise<void> {
    if (tournament.tournamentSteps.length >= tournament.nbStep) {
      throw new Error("Max step");
    }
    const startDate = new Date(
      tournament.tournamentSteps[tournament.tournamentSteps.length - 1].endDate,
    );
    tournament.tournamentSteps.push(
      await this.generateTournamentStep(
        trainers,
        startDate,
        tournament.gameId,
        tournament.competitionId,
        SerieTypes.BO3,
      ),
    );
    await this.tournamentRepository.update(tournament._id, tournament);
  }

  public generateTournamentPairs(
    trainers: ITrainer[],
  ): { player: ITrainer; opponent: ITrainer }[] {
    if (!isPowerOfTwo(trainers.length)) {
      throw new Error("La taille du tournoi doit être une puissance de 2.");
    }
    const matches: { player: ITrainer; opponent: ITrainer }[] = [];
    const numberOfPlayers = trainers.length;

    for (let i = 0; i < numberOfPlayers / 2; i++) {
      const pair = {
        player: trainers[i],
        opponent: trainers[numberOfPlayers - i - 1],
      };
      matches.push(pair);
    }

    return matches;
  }

  public async tournamentStepEnd(
    gameId: string,
    actualDate: Date,
  ): Promise<void> {
    const tournaments = await this.tournamentRepository.getUpdateTournaments(
      actualDate,
      gameId,
    );
    for (const tournament of tournaments) {
      const winnerIds: string[] = [];
      const lastStep = tournament.tournamentSteps.at(-1);
      lastStep.battleSeries.forEach((serie) => {
        winnerIds.push(this.battleInstanceService.isSerieWin(serie));
      });
      const trainers = await this.trainerRepository.list({ ids: winnerIds });
      await this.addTournamentStep(trainers, tournament);
    }
  }
}
