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
import NurseryRepository from "../../domain/nursery/NurseryRepository";
import TrainerService from "../trainer/TrainerService";
import BattleService from "../battle/BattleService";
import NurseryService from "../nursery/NurseryService";
import PokemonService from "../pokemon/PokemonService";
import WebsocketServerService from "../../WebsocketServerService";
import { singleton } from "tsyringe";

@singleton()
class CalendarEventService {
  constructor(
    protected battleInstanceService: BattleInstanceRepository,
    protected calendarEventRepository: CalendarEventRepository,
    protected trainerRepository: TrainerRepository,
    protected gameRepository: GameRepository,
    protected pokemonService: PokemonService,
    protected nurseryService: NurseryService,
    protected trainerService: TrainerService,
    protected battleService: BattleService,
    protected nurseryRepository: NurseryRepository,
    protected websocketServerService: WebsocketServerService,
  ) {}

  public async createBattleEvent(
    date: Date,
    trainers: ITrainer[],
    gameId: string,
  ): Promise<ICalendarEvent> {
    const battleDTO = await this.battleInstanceService.create({
      player: trainers[0],
      opponent: trainers[1],
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
      date.setUTCDate(date.getUTCDate() + 1);
      const newGame = await this.gameRepository.get(game);
      newGame.actualDate = date;
      await this.gameRepository.update(game, newGame);
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
          "error",
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
}

export default CalendarEventService;
