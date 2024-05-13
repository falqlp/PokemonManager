import { ITrainer } from "../../domain/trainer/Trainer";
import {
  CalendarEventEvent,
  ICalendarEvent,
} from "../../domain/calendarEvent/CalendarEvent";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import GameRepository from "../../domain/game/GameRepository";
import NurseryRepository from "../../domain/trainer/nursery/NurseryRepository";
import TrainerService from "../trainer/TrainerService";
import BattleService from "../battle/BattleService";
import NurseryService from "../trainer/nursery/NurseryService";
import PokemonService from "../pokemon/PokemonService";
import WebsocketServerService, {
  NotificationType,
} from "../../WebsocketServerService";
import { singleton } from "tsyringe";
import {
  CompetitionType,
  ICompetition,
} from "../../domain/competiton/Competition";
import CompetitionService from "../competition/CompetitionService";
import { addDays } from "../../utils/DateUtils";
import { BattleInstanceService } from "../battleInstance/BattleInstanceService";
import TournamentService from "../competition/tournament/TournamentService";
import ExperienceService from "../experience/ExperienceService";
import TrainerMapper from "../../api/trainer/TrainerMapper";
import CompetitionRepository from "../../domain/competiton/CompetitionRepository";
import { IGame } from "../../domain/game/Game";
import { ICompetitionHistory } from "../../domain/competiton/competitionHistory/CompetitionHistory";
import CompetitionHistoryRepository from "../../domain/competiton/competitionHistory/CompetitionHistoryRepository";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import GenerateCalendarService from "./GenerateCalendarService";

@singleton()
class CalendarEventService {
  constructor(
    private battleInstanceRepository: BattleInstanceRepository,
    private battleInstanceService: BattleInstanceService,
    private calendarEventRepository: CalendarEventRepository,
    private trainerRepository: TrainerRepository,
    private gameRepository: GameRepository,
    private pokemonService: PokemonService,
    private nurseryService: NurseryService,
    private trainerService: TrainerService,
    private battleService: BattleService,
    private nurseryRepository: NurseryRepository,
    private websocketServerService: WebsocketServerService,
    private competitionService: CompetitionService,
    private tournamentService: TournamentService,
    private experienceService: ExperienceService,
    private trainerMapper: TrainerMapper,
    private competitionRepository: CompetitionRepository,
    private competitionHistoryRepository: CompetitionHistoryRepository,
    private pokemonRepository: PokemonRepository,
    private generateCalendarService: GenerateCalendarService,
  ) {}

  public async createBattleEvent(
    date: Date,
    trainers: ITrainer[],
    competition: ICompetition,
    gameId: string,
  ): Promise<ICalendarEvent> {
    const battleDTO = await this.battleInstanceRepository.create({
      player: trainers[0],
      opponent: trainers[1],
      competition,
      gameId,
    });
    return await this.calendarEventRepository.create({
      event: battleDTO,
      date,
      trainers,
      type: CalendarEventEvent.BATTLE,
      gameId,
    });
  }

  public async getWeekCalendar(
    trainerId: string,
    date: Date,
    gameId: string,
  ): Promise<ICalendarEvent[][]> {
    const actualDate = new Date(date);
    const minDate = new Date(date);
    const maxDate = new Date(date);

    minDate.setUTCDate(actualDate.getUTCDate() - 1);
    maxDate.setUTCDate(actualDate.getUTCDate() + 5);
    const events = await this.calendarEventRepository.list({
      custom: {
        trainers: trainerId,
        date: { $gte: minDate, $lte: maxDate },
        gameId,
      },
    });
    const week: ICalendarEvent[][] = Array.from({ length: 7 }, () => []);
    events.forEach((event) => {
      const nextDay = new Date(actualDate);
      nextDay.setUTCDate(actualDate.getUTCDate() + 1);
      week[
        (event.date.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24) + 2
      ].push(event);
    });
    return week;
  }

  public async simulateDay(
    trainerId: string,
    date: Date,
    game: string,
  ): Promise<{ date: Date; battle: IBattleInstance; redirectTo: string }> {
    date = new Date(date);
    let redirectTo: string = null;
    const events = await this.calendarEventRepository.list({
      custom: { trainers: trainerId, date },
    });
    const battle = events.find(
      (event) =>
        event.type === CalendarEventEvent.BATTLE && !event.event.winner,
    )?.event;
    await this.simulateBattleForDay(game, date, trainerId);
    const trainer = await this.trainerRepository.get(trainerId);
    if (!battle) {
      redirectTo = await this.nurseryEvents(
        events,
        trainer,
        date,
        game,
        redirectTo,
      );
      date = addDays(date, 1);
      const newGame = await this.gameRepository.get(game);
      newGame.actualDate = date;
      await this.gameRepository.update(game, newGame);
      await this.competitionService.championshipEnd(game, addDays(date, -1));
      await this.tournamentService.tournamentStepEnd(game, addDays(date, -1));
      if (date.getDay() === 1) {
        await this.experienceService.xpForOtherTrainer(game, trainerId, date);
        const res = await this.experienceService.weeklyXpGain(trainerId);
        res.trainer = this.trainerMapper.map(res.trainer);
        this.websocketServerService.sendMessageToClientInGame(game, {
          type: "weeklyXp",
          payload: res,
        });
      }
      if (date.getMonth() === 0 && date.getDate() === 1) {
        await this.newSeason(newGame);
      }
    }
    await this.pokemonService.isHatched(date, game);
    return { date, battle, redirectTo };
  }

  public async nurseryEvents(
    events: ICalendarEvent[],
    trainer: ITrainer,
    date: Date,
    game: string,
    redirectTo: string,
  ): Promise<string> {
    const nursery = trainer.nursery;
    if (
      events.find(
        (event) => event.type === CalendarEventEvent.GENERATE_NURSERY_EGGS,
      ) &&
      nursery.eggs?.length === 0
    ) {
      await this.nurseryService.generateNurseryEgg(nursery, game);
    }
    if (
      events.find(
        (event) =>
          event.type === CalendarEventEvent.NURSERY_FIRST_SELECTION_DEADLINE ||
          event.type === CalendarEventEvent.NURSERY_LAST_SELECTION_DEADLINE,
      )
    ) {
      if (
        nursery.eggs?.length >
        nursery.wishList.quantity * (nursery.step === "FIRST_SELECTION" ? 2 : 1)
      ) {
        date.setUTCDate(date.getUTCDate() - 1);
        redirectTo = "nursery";
        this.websocketServerService.notify(
          "SELECT_VALID_NUMBER_OF_EGGS",
          NotificationType.Neutral,
          game,
        );
      } else {
        if (nursery.step === "FIRST_SELECTION") {
          nursery.step = "LAST_SELECTION";
        } else {
          nursery.eggs.forEach((egg) => {
            const hatchingDate = new Date(date);
            hatchingDate.setUTCMonth(hatchingDate.getUTCMonth() + 1);
            egg.hatchingDate = hatchingDate;
            this.trainerService.addPokemonForTrainer(egg, trainer._id);
          });
          nursery.eggs = [];
          nursery.step = "WISHLIST";
        }
        await this.nurseryRepository.update(nursery._id, nursery);
      }
    }
    return redirectTo;
  }

  private async simulateBattleForDay(
    gameId: string,
    date: Date,
    trainerId: string,
  ): Promise<void> {
    const battles = await this.calendarEventRepository.list({
      custom: {
        gameId,
        date,
        "event.winner": { $exists: false },
        trainers: { $nin: [trainerId] },
      },
    });
    for (const value of battles) {
      value.event = this.battleService.simulateBattle(value.event);
      await this.battleInstanceService.update(value.event._id, value.event);
    }
  }

  private async newSeason(game: IGame): Promise<void> {
    await this.archiveCurrentComepetition(game);
    await this.pokemonRepository.archiveOldPokemon(game);

    const noPokemonTrainers = await this.trainerRepository.list({
      custom: { gameId: game._id, pokemons: { $size: 0 } },
    });
    await this.trainerService.generateTrainerWithPokemon(
      game,
      noPokemonTrainers.length,
    );
    for (const trainer of noPokemonTrainers) {
      await this.trainerRepository.deleteTrainer(trainer);
    }
    const championship = await this.competitionService.createChampionship(game);
    const trainers = await this.trainerRepository.list(
      {},
      { gameId: game._id },
    );
    trainers.map((trainer) => {
      trainer.competitions.push(championship);
      return trainer;
    });
    await this.trainerService.updateMany(trainers);
    await this.generateCalendarService.generateChampionship(
      trainers,
      3,
      game._id,
      championship,
    );
  }

  private async archiveCurrentComepetition(game: IGame): Promise<void> {
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
      } else if (competitionHistory.type !== CompetitionType.TOURNAMENT) {
        competitionHistory.ranking =
          await this.battleInstanceService.getChampionshipRanking(
            competition._id,
          );
      }
      competitionHistoryArray.push(competitionHistory);
    }
    await this.competitionHistoryRepository.insertMany(competitionHistoryArray);
    await this.competitionRepository.archiveMany(
      competitions.map((competition) => competition._id),
    );
  }
}

export default CalendarEventService;
