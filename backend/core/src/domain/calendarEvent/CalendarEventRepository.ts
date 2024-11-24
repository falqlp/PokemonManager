import CompleteRepository from 'shared/common/domain/CompleteRepository';
import CalendarEvent, { ICalendarEvent } from './CalendarEvent';
import { Injectable } from '@nestjs/common';
import CalendarEventPopulater from './CalendarEventPopulater';
import { addDays } from 'shared/utils/DateUtils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BattleInstanceRepository from '../battleInstance/BattleInstanceRepository';

@Injectable()
class CalendarEventRepository extends CompleteRepository<ICalendarEvent> {
  constructor(
    calendarEventPopulater: CalendarEventPopulater,
    @InjectModel(CalendarEvent.modelName)
    protected override readonly schema: Model<ICalendarEvent>,
    protected readonly battleRepository: BattleInstanceRepository,
  ) {
    super(schema, calendarEventPopulater);
  }

  public insertManyWithoutMapAndPopulate(
    dtos: ICalendarEvent[],
  ): Promise<ICalendarEvent[]> {
    return this.schema.insertMany(dtos);
  }

  public override async delete(_id: string): Promise<ICalendarEvent> {
    const calendarEvent = await this.get(_id);
    if (calendarEvent.event) {
      await this.battleRepository.delete(calendarEvent.event._id);
    }
    return super.delete(_id);
  }

  public async deleteTournamentBattle(
    date: Date,
    battleIds: string[],
  ): Promise<void> {
    const res: ICalendarEvent[] = await this.schema.find({
      event: { $in: battleIds },
      date: { $gt: addDays(date, 1) },
    });
    const deleteBattleIds = res.map((val) => val.event as unknown as string);
    await this.battleRepository.deleteMany({
      _id: { $in: deleteBattleIds },
      winner: { $exists: false },
    });
    const deleteEventIds = res.map((value) => value._id);
    await this.schema.deleteMany({ _id: { $in: deleteEventIds } });
  }

  public async getBattleDate(battleId: string): Promise<Date> {
    return (await this.schema.findOne({ event: battleId })).date;
  }
}

export default CalendarEventRepository;
