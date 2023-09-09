import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { CalendarEventModel } from '../../models/calendar-event.model';
import { Observable } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventQueriesService extends CompleteQuery<CalendarEventModel> {
  public static readonly url = 'api/calendar-event';
  public constructor(protected override http: HttpClient) {
    super(CalendarEventQueriesService.url, http);
  }

  public createBattleEvent(
    date: Date,
    trainers: TrainerModel[]
  ): Observable<CalendarEventModel> {
    return this.http.post<CalendarEventModel>(
      CalendarEventQueriesService.url + '/battle',
      { date, trainers }
    );
  }

  public getWeekCalendar(
    trainerId: string,
    date: Date
  ): Observable<CalendarEventModel[][]> {
    return this.http.post<CalendarEventModel[][]>(
      CalendarEventQueriesService.url + '/weekCalendar',
      {
        trainerId,
        date,
      }
    );
  }
}
