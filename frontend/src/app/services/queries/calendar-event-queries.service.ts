import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { CalendarEventModel } from '../../models/calendar-event.model';
import { Observable, tap } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { BattleModel } from '../../models/Battle.model';
import { TimeService } from '../time.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventQueriesService extends CompleteQuery<CalendarEventModel> {
  public static readonly url = 'api/calendar-event';
  public constructor(
    protected override http: HttpClient,
    protected timeService: TimeService
  ) {
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

  public simulateDay(
    trainerId: string,
    date: Date
  ): Observable<{ date: Date; battle: BattleModel; redirectTo: string }> {
    return this.http
      .post<{ date: Date; battle: BattleModel; redirectTo: string }>(
        CalendarEventQueriesService.url + '/simulateDay',
        {
          trainerId,
          date,
        }
      )
      .pipe(
        tap((res) => {
          if (!res.battle) {
            res.date = new Date(res.date);
            this.timeService.updateDate(res.date);
          }
        })
      );
  }
}
