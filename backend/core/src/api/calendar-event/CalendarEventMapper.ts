import { IMapper } from 'shared/common/domain/IMapper';
import {
  CalendarEventEvent,
  ICalendarEvent,
} from '../../domain/calendarEvent/CalendarEvent';
import TrainerMapper from '../trainer/TrainerMapper';
import BattleInstanceMapper from '../battle-instance/BattleInstanceMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
class CalendarEventMapper implements IMapper<ICalendarEvent> {
  constructor(
    protected trainerMapper: TrainerMapper,
    protected battleInstanceMapper: BattleInstanceMapper,
  ) {}

  public map(dto: ICalendarEvent): ICalendarEvent {
    if (dto.type === CalendarEventEvent.BATTLE) {
      dto.event = this.battleInstanceMapper.map(dto.event);
    }
    dto.trainers.map((trainer) => this.trainerMapper.mapPartial(trainer));
    return dto;
  }
}

export default CalendarEventMapper;
