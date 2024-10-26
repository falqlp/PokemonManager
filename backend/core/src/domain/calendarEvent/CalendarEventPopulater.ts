import Populater from '../Populater';
import { Model, PopulateOptions } from 'mongoose';
import { BattleInstancePopulater } from '../battleInstance/BattleInstancePopulater';
import TrainerPopulater from '../trainer/TrainerPopulater';
import { Injectable } from '@nestjs/common';
import CalendarEvent, { ICalendarEvent } from './CalendarEvent';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class CalendarEventPopulater extends Populater<ICalendarEvent> {
  constructor(
    @InjectModel(CalendarEvent.modelName)
    public readonly schema: Model<ICalendarEvent>,
    protected battleInstancePopulater: BattleInstancePopulater,
    protected trainerPopulater: TrainerPopulater,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: 'event',
        model: this.battleInstancePopulater.schema,
        populate: this.battleInstancePopulater.populate(),
      },
      {
        path: 'trainers',
        model: this.trainerPopulater.schema,
        populate: this.trainerPopulater.populate(),
      },
    ];
  }
}

export default CalendarEventPopulater;
