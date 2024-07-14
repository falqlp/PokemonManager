import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEventModel } from '../../models/calendar-event.model';
import { Observable } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { BattleModel } from '../../models/Battle.model';
import { TimeService } from '../time.service';
import { CompetitionModel } from '../../models/competition.model';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventQueriesService extends ReadonlyQuery<CalendarEventModel> {
  public static readonly url = 'api/calendar-event';
  public constructor(
    protected override http: HttpClient,
    protected timeService: TimeService
  ) {
    super(CalendarEventQueriesService.url, http);
  }

  public createBattleEvent(
    date: Date,
    trainers: TrainerModel[],
    competition: CompetitionModel
  ): Observable<CalendarEventModel> {
    return this.http.post<CalendarEventModel>(this.url + '/battle', {
      date,
      trainers,
      competition,
    });
  }

  public getWeekCalendar(
    trainerId: string,
    date: Date
  ): Observable<CalendarEventModel[][]> {
    return this.http.post<CalendarEventModel[][]>(this.url + '/weekCalendar', {
      trainerId,
      date,
    });
  }

  public askNextDay(
    trainerId: string,
    date: Date
  ): Observable<{
    battle: BattleModel;
    redirectTo: string;
    isMultiplayerBattle: boolean;
  }> {
    return this.http.put<{
      battle: BattleModel;
      redirectTo: string;
      isMultiplayerBattle: boolean;
    }>(this.url + '/askNextDay', { trainerId, date });
  }

  public deleteAskNextDay(trainerId: string): Observable<void> {
    return this.http.put<void>(this.url + '/deleteAskNextDay', { trainerId });
  }

  public updateAskNextDay(): Observable<void> {
    return this.http.get<void>(this.url + '/updateAskNextDay');
  }
}
