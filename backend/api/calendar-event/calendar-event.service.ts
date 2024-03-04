import CompleteService from "../CompleteService";
import CalendarEvent, { ICalendarEvent } from "./calendar-event";
import CalendarEventMapper from "./calendar-event.mapper";
import BattleInstanceService from "../battle-instance/battle-instance.service";
import { ITrainer } from "../trainer/trainer";
import { IBattleInstance } from "../battle-instance/battle";
import GameService from "../game/game.service";
import PokemonService from "../pokemon/pokemon.service";
import NurseryService from "../nursery/nursery.service";
import { notify } from "../../websocketServer";
import TrainerService from "../trainer/trainer.service";

class CalendarEventService extends CompleteService<ICalendarEvent> {
  private static instance: CalendarEventService;

  constructor(
    protected battleInstanceService: BattleInstanceService,
    protected gameService: GameService,
    protected pokemonService: PokemonService,
    protected nurseryService: NurseryService,
    protected trainerService: TrainerService
  ) {
    super(CalendarEvent, CalendarEventMapper.getInstance());
  }
  public static getInstance(): CalendarEventService {
    if (!CalendarEventService.instance) {
      CalendarEventService.instance = new CalendarEventService(
        BattleInstanceService.getInstance(),
        GameService.getInstance(),
        PokemonService.getInstance(),
        NurseryService.getInstance(),
        TrainerService.getInstance()
      );
    }
    return CalendarEventService.instance;
  }

  public async createBattleEvent(
    date: Date,
    trainers: ITrainer[],
    gameId: string
  ): Promise<ICalendarEvent> {
    const battleDTO = await this.battleInstanceService.create(
      {
        player: trainers[0],
        opponent: trainers[1],
      } as IBattleInstance,
      gameId
    );
    return await this.create(
      {
        event: battleDTO,
        date,
        trainers,
        type: "Battle",
      } as ICalendarEvent,
      gameId
    );
  }

  public async getWeekCalendar(
    trainerId: string,
    date: Date,
    gameId: string
  ): Promise<ICalendarEvent[][]> {
    const actualDate = new Date(date);
    const minDate = new Date(date);
    const maxDate = new Date(date);

    minDate.setUTCDate(actualDate.getUTCDate() - 1);
    maxDate.setUTCDate(actualDate.getUTCDate() + 5);
    const events = await this.list({
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
    game: string
  ): Promise<{ date: Date; battle: IBattleInstance; redirectTo: string }> {
    date = new Date(date);
    let redirectTo: string = null;
    const events = await this.list({
      custom: { trainers: trainerId, date },
    });
    const battle = events.find(
      (event) => event.type === "Battle" && !event.event.winner
    )?.event;

    const trainer = await this.trainerService.getComplete(trainerId);
    if (!battle) {
      redirectTo = await this.nurseryEvents(
        events,
        trainer,
        date,
        game,
        redirectTo
      );
      date.setUTCDate(date.getUTCDate() + 1);
      const newGame = await this.gameService.get(game);
      newGame.actualDate = date;
      await this.gameService.update(game, newGame);
    }
    await this.pokemonService.isHatched(date, game);
    return { date, battle, redirectTo };
  }

  public async nurseryEvents(
    events: ICalendarEvent[],
    trainer: ITrainer,
    date: Date,
    game: string,
    redirectTo: string
  ): Promise<string> {
    const nursery = trainer.nursery;
    if (
      events.find((event) => event.type === "GenerateNurseryEggs") &&
      nursery.eggs?.length === 0
    ) {
      await this.nurseryService.generateNurseryEgg(nursery, game);
    }
    if (
      events.find(
        (event) =>
          event.type === "NurseryFirstSelectionDeadline" ||
          event.type === "NurseryLastSelectionDeadline"
      )
    ) {
      if (
        nursery.eggs?.length >
        nursery.wishList.quantity * (nursery.step === "FIRST_SELECTION" ? 2 : 1)
      ) {
        date.setUTCDate(date.getUTCDate() - 1);
        redirectTo = "nursery";
        notify("SELECT_VALID_NUMBER_OF_EGGS", "error", game);
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
        await this.nurseryService.update(nursery._id, nursery);
      }
    }
    return redirectTo;
  }
}

export default CalendarEventService;
