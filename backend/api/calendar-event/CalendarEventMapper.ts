import { IMapper } from "../IMapper";
import { CalendarEventEvent, ICalendarEvent } from "./CalendarEvent";
import { PopulateOptions } from "mongoose";
import Battle from "../battle-instance/Battle";
import Trainer from "../../domain/trainer/Trainer";
import TrainerMapper from "../../domain/trainer/TrainerMapper";
import BattleInstanceMapper from "../battle-instance/BattleInstanceMapper";

class CalendarEventMapper implements IMapper<ICalendarEvent> {
  private static instance: CalendarEventMapper;
  constructor(
    protected trainerMapper: TrainerMapper,
    protected battleInstanceMapper: BattleInstanceMapper
  ) {}

  public populate(): PopulateOptions[] {
    return [
      {
        path: "event",
        model: Battle,
        populate: this.battleInstanceMapper.populate(),
      },
      {
        path: "trainers",
        model: Trainer,
        populate: this.trainerMapper.populate(),
      },
    ];
  }
  public map(dto: ICalendarEvent): ICalendarEvent {
    if (dto.type === CalendarEventEvent.BATTLE) {
      dto.event = this.battleInstanceMapper.map(dto.event);
    }
    dto.trainers.map((trainer) => this.trainerMapper.mapPartial(trainer));
    return dto;
  }

  public update(dto: ICalendarEvent): ICalendarEvent {
    return dto;
  }

  public static getInstance(): CalendarEventMapper {
    if (!CalendarEventMapper.instance) {
      CalendarEventMapper.instance = new CalendarEventMapper(
        TrainerMapper.getInstance(),
        BattleInstanceMapper.getInstance()
      );
    }
    return CalendarEventMapper.instance;
  }
}

export default CalendarEventMapper;
