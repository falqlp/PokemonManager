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
  public async map(
    dto: ICalendarEvent,
    partyId: string
  ): Promise<ICalendarEvent> {
    dto.event = await this.battleInstanceService.get(
      dto.event as unknown as string,
      { partyId }
    );
    dto.trainers = await this.trainerService.listPartial(
      {
        ids: dto.trainers as unknown as string[],
      },
      partyId
    );
    return dto;
  }

  public update(dto: ICalendarEvent): ICalendarEvent {
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
