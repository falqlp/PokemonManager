import CompleteService from "../../api/CompleteService";
import CalendarEvent, { ICalendarEvent } from "./CalendarEvent";
import CalendarEventMapper from "./CalendarEventMapper";

class CalendarEventRepository extends CompleteService<ICalendarEvent> {
  private static instance: CalendarEventRepository;

  public static getInstance(): CalendarEventRepository {
    if (!CalendarEventRepository.instance) {
      CalendarEventRepository.instance = new CalendarEventRepository(
        CalendarEvent,
        CalendarEventMapper.getInstance()
      );
    }
    return CalendarEventRepository.instance;
  }

  public insertManyWithoutMapAndPopulate(
    dtos: ICalendarEvent[]
  ): Promise<ICalendarEvent[]> {
    return this.schema.insertMany(dtos);
  }
}

export default CalendarEventRepository;
