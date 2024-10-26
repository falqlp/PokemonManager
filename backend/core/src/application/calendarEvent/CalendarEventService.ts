import { ITrainer } from '../../domain/trainer/Trainer';
import {
  CalendarEventEvent,
  ICalendarEvent,
} from '../../domain/calendarEvent/CalendarEvent';
import BattleInstanceRepository from '../../domain/battleInstance/BattleInstanceRepository';
import CalendarEventRepository from '../../domain/calendarEvent/CalendarEventRepository';
import { Injectable } from '@nestjs/common';
import { ICompetition } from '../../domain/competiton/Competition';
import GameRepository from '../../domain/game/GameRepository';
import { addDays } from '../../utils/DateUtils';

@Injectable()
class CalendarEventService {
  constructor(
    private battleInstanceRepository: BattleInstanceRepository,
    private calendarEventRepository: CalendarEventRepository,
    private gameRepository: GameRepository,
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

  public async createNurseryEvent(
    gameId: string,
    trainer: ITrainer,
  ): Promise<void> {
    const actualDate = (await this.gameRepository.get(gameId))?.actualDate;
    const newdate = new Date(actualDate);
    newdate.setUTCMonth(newdate.getUTCMonth() + 1);
    const firstEventDate = new Date(newdate);
    const secondEventDate = addDays(firstEventDate, 7);
    const thirdEventDate = addDays(secondEventDate, 14);
    const calendarEvents: ICalendarEvent[] = [
      {
        type: CalendarEventEvent.GENERATE_NURSERY_EGGS,
        date: firstEventDate,
        trainers: [trainer],
        gameId,
      },
      {
        type: CalendarEventEvent.NURSERY_FIRST_SELECTION_DEADLINE,
        date: secondEventDate,
        trainers: [trainer],
        gameId,
      },
      {
        type: CalendarEventEvent.NURSERY_LAST_SELECTION_DEADLINE,
        date: thirdEventDate,
        trainers: [trainer],
        gameId,
      },
    ];
    await this.calendarEventRepository.insertMany(calendarEvents);
  }
}

export default CalendarEventService;
