import { IMapper } from "../../domain/IMapper";
import {
  CalendarEventEvent,
  ICalendarEvent,
} from "../../domain/calendarEvent/CalendarEvent";
import TrainerMapper from "../trainer/TrainerMapper";
import BattleInstanceMapper from "../battle-instance/BattleInstanceMapper";

class CalendarEventMapper implements IMapper<ICalendarEvent> {
  private static instance: CalendarEventMapper;
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

  public static getInstance(): CalendarEventMapper {
    if (!CalendarEventMapper.instance) {
      CalendarEventMapper.instance = new CalendarEventMapper(
        TrainerMapper.getInstance(),
        BattleInstanceMapper.getInstance(),
      );
    }
    return CalendarEventMapper.instance;
  }
}

export default CalendarEventMapper;
