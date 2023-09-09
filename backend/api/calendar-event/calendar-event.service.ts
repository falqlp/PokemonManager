import CompleteService from "../CompleteService";
import CalendarEvent, { ICalendarEvent } from "./calendar-event";
import CalendarEventMapper from "./calendar-event.mapper";
import BattleInstanceService from "../battle-instance/battle-instance.service";
import { ITrainer } from "../trainer/trainer";
import Battle, { IBattleInstance } from "../battle-instance/battle";

class CalendarEventService extends CompleteService<ICalendarEvent> {
  private static instance: CalendarEventService;

  constructor(protected battleInstanceService: BattleInstanceService) {
    super(CalendarEvent, CalendarEventMapper.getInstance());
  }
  public static getInstance(): CalendarEventService {
    if (!CalendarEventService.instance) {
      CalendarEventService.instance = new CalendarEventService(
        BattleInstanceService.getInstance()
      );
    }
    return CalendarEventService.instance;
  }

  public async createBattleEvent(
    date: Date,
    trainers: ITrainer[]
  ): Promise<ICalendarEvent> {
    const battleDTO = await this.battleInstanceService.create({
      player: trainers[0],
      opponent: trainers[1],
    } as IBattleInstance);
    return await this.create({
      event: battleDTO,
      date,
      trainers,
      type: "Battle",
    } as ICalendarEvent);
  }

  public async getWeekCalendar(
    trainerId: string,
    date: Date
  ): Promise<ICalendarEvent[][]> {
    const actualDate = new Date(date);
    const minDate = new Date(date);
    const maxDate = new Date(date);

    minDate.setDate(actualDate.getDate() - 1);
    maxDate.setDate(actualDate.getDate() + 5);
    const events = await this.list({
      custom: { trainers: trainerId, date: { $gte: minDate, $lte: maxDate } },
    });
    const week: ICalendarEvent[][] = Array.from({ length: 7 }, () => []);
    events.forEach((event) => {
      week[event.date.getDate() - actualDate.getDate() + 1].push(event);
    });
    return week;
  }
}

export default CalendarEventService;
