import { IMapper } from "../IMapper";
import { ICalendarEvent } from "./calendar-event";
import { PopulateOptions } from "mongoose";
import Battle from "../battle-instance/battle";
import Trainer from "../trainer/trainer";
import TrainerMapper from "../trainer/trainer.mapper";
import BattleInstanceMapper from "../battle-instance/battle-instance.mapper";

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
    if (dto.type === "Battle") {
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
