import CompleteRepository from "../CompleteRepository";
import CalendarEvent, { ICalendarEvent } from "./CalendarEvent";
import CalendarEventPopulater from "./CalendarEventPopulater";

class CalendarEventRepository extends CompleteRepository<ICalendarEvent> {
  private static instance: CalendarEventRepository;

  public static getInstance(): CalendarEventRepository {
    if (!CalendarEventRepository.instance) {
      CalendarEventRepository.instance = new CalendarEventRepository(
        CalendarEvent,
        CalendarEventPopulater.getInstance(),
      );
    }
    return CalendarEventRepository.instance;
  }

  public insertManyWithoutMapAndPopulate(
    dtos: ICalendarEvent[],
  ): Promise<ICalendarEvent[]> {
    return this.schema.insertMany(dtos);
  }
}

export default CalendarEventRepository;
