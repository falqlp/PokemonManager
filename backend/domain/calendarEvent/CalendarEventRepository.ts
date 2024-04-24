import CompleteRepository from "../CompleteRepository";
import CalendarEvent, { ICalendarEvent } from "./CalendarEvent";
import { singleton } from "tsyringe";
import CalendarEventPopulater from "./CalendarEventPopulater";

@singleton()
class CalendarEventRepository extends CompleteRepository<ICalendarEvent> {
  constructor(calendarEventPopulater: CalendarEventPopulater) {
    super(CalendarEvent, calendarEventPopulater);
  }

  public insertManyWithoutMapAndPopulate(
    dtos: ICalendarEvent[],
  ): Promise<ICalendarEvent[]> {
    return this.schema.insertMany(dtos);
  }
}

export default CalendarEventRepository;
