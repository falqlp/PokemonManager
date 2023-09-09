import { IMapper } from "../IMapper";
import { ICalendarEvent } from "./calendar-event";
import BattleInstanceService from "../battle-instance/battle-instance.service";
import TrainerService from "../trainer/trainer.service";

class CalendarEventMapper implements IMapper<ICalendarEvent> {
  private static instance: CalendarEventMapper;
  constructor(
    protected battleInstanceService: BattleInstanceService,
    protected trainerService: TrainerService
  ) {}
  public async map(dto: ICalendarEvent): Promise<ICalendarEvent> {
    dto.event = await this.battleInstanceService.get(
      dto.event as unknown as string
    );
    dto.trainers = await this.trainerService.list({
      ids: dto.trainers as unknown as string[],
    });
    return dto;
  }

  public update(dto: ICalendarEvent): ICalendarEvent {
    dto.event = dto.event._id;
    dto.trainers = dto.trainers?.map((trainer) => trainer._id);
    return dto;
  }

  public static getInstance(): CalendarEventMapper {
    if (!CalendarEventMapper.instance) {
      CalendarEventMapper.instance = new CalendarEventMapper(
        BattleInstanceService.getInstance(),
        TrainerService.getInstance()
      );
    }
    return CalendarEventMapper.instance;
  }
}

export default CalendarEventMapper;
