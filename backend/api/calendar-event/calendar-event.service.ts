import CompleteService from "../CompleteService";
import CalendarEvent, { ICalendarEvent } from "./calendar-event";
import CalendarEventMapper from "./calendar-event.mapper";
import BattleInstanceService from "../battle-instance/battle-instance.service";
import { ITrainer } from "../trainer/trainer";
import Battle, { IBattleInstance } from "../battle-instance/battle";
import PartyService from "../party/party.service";

class CalendarEventService extends CompleteService<ICalendarEvent> {
  private static instance: CalendarEventService;

  constructor(
    protected battleInstanceService: BattleInstanceService,
    protected partyService: PartyService
  ) {
    super(CalendarEvent, CalendarEventMapper.getInstance());
  }
  public static getInstance(): CalendarEventService {
    if (!CalendarEventService.instance) {
      CalendarEventService.instance = new CalendarEventService(
        BattleInstanceService.getInstance(),
        PartyService.getInstance()
      );
    }
    return CalendarEventService.instance;
  }

  public async createBattleEvent(
    date: Date,
    trainers: ITrainer[],
    partyId: string
  ): Promise<ICalendarEvent> {
    const battleDTO = await this.battleInstanceService.create(
      {
        player: trainers[0],
        opponent: trainers[1],
      } as IBattleInstance,
      partyId
    );
    return await this.create(
      {
        event: battleDTO,
        date,
        trainers,
        type: "Battle",
      } as ICalendarEvent,
      partyId
    );
  }

  public async getWeekCalendar(
    trainerId: string,
    date: Date
  ): Promise<ICalendarEvent[][]> {
    const actualDate = new Date(date);
    const minDate = new Date(date);
    const maxDate = new Date(date);

    minDate.setUTCDate(actualDate.getUTCDate() - 1);
    maxDate.setUTCDate(actualDate.getUTCDate() + 5);
    const events = await this.list({
      custom: { trainers: trainerId, date: { $gte: minDate, $lte: maxDate } },
    });
    const week: ICalendarEvent[][] = Array.from({ length: 7 }, () => []);
    events.forEach((event) => {
      week[event.date.getDate() - actualDate.getDate() + 1].push(event);
    });
    return week;
  }

  // a refactor avec partyId dans le header
  public async simulateDay(
    trainerId: string,
    date: Date,
    party: string
  ): Promise<{ date: Date; battle: IBattleInstance }> {
    date = new Date(date);
    const events = await this.list({
      custom: { trainers: trainerId, date },
    });
    const battle = events.find(
      (event) => event.type === "Battle" && !event.event.winner
    )?.event;
    if (!battle) {
      date.setUTCDate(date.getUTCDate() + 1);
      const newParty = await this.partyService.get(party);
      newParty.actualDate = date;
      await this.partyService.update(party, newParty);
    }
    return { date, battle };
  }
}

export default CalendarEventService;
