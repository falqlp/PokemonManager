import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap } from 'rxjs';
import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { CalendarEventModel } from '../../models/calendar-event.model';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { BattleModel } from '../../models/Battle.model';
import { TranslateModule } from '@ngx-translate/core';
import { BattleStatusComponent } from '../battle-status/battle-status.component';

@Component({
  standalone: true,
  selector: 'app-top-bar-week-calendar',
  templateUrl: './top-bar-week-calendar.component.html',
  styleUrls: ['./top-bar-week-calendar.component.scss'],
  imports: [
    NgForOf,
    AsyncPipe,
    NgClass,
    TranslateModule,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    BattleStatusComponent,
  ],
})
export class TopBarWeekCalendarComponent implements OnInit {
  @Input() public player: TrainerModel;
  protected data$: Observable<string[]>;
  protected events: CalendarEventModel[][];
  protected version = 0;
  protected actualDate: string;

  public constructor(
    protected timeService: TimeService,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.data$ = this.timeService.getActualDate().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((actualDate) => {
        return this.calendarEventQueriesService
          .getWeekCalendar(this.player._id, actualDate)
          .pipe(
            map((res) => {
              this.events = res;
              return actualDate;
            })
          );
      }),
      map((actualDate) => {
        this.actualDate = this.timeService.dateToSimplifyLocalDate(actualDate);
        this.version += 1;
        const week: string[] = [];
        const newDate = new Date(actualDate);
        newDate.setUTCDate(newDate.getUTCDate() - 1);
        for (let i = 0; i < 7; i++) {
          week[i] = `${this.timeService.dateToSimplifyLocalDate(newDate)}-${
            this.version
          }`;
          newDate.setUTCDate(newDate.getUTCDate() + 1);
        }
        return week;
      })
    );
  }
}
