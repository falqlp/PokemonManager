import { ITrainer } from "../../domain/trainer/Trainer";
import {
  CalendarEventEvent,
  ICalendarEvent,
} from "../../domain/calendarEvent/CalendarEvent";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import { singleton } from "tsyringe";
import { ICompetition } from "../../domain/competiton/Competition";

@singleton()
class CalendarEventService {
  constructor(
    private battleInstanceRepository: BattleInstanceRepository,
    private calendarEventRepository: CalendarEventRepository,
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
}

export default CalendarEventService;
