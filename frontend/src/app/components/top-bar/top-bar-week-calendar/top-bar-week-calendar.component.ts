import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import {
  AsyncPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import {
  CalendarEventEvent,
  CalendarEventModel,
} from '../../../models/calendar-event.model';
import { CalendarEventQueriesService } from '../../../services/queries/calendar-event-queries.service';
import { TrainerModel } from '../../../models/TrainersModels/trainer.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BattleStatusComponent } from '../../battle-status/battle-status.component';
import { TrainerNameComponent } from '../../trainer-name/trainer-name.component';
import { PlayerService } from '../../../services/player.service';

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
    TrainerNameComponent,
  ],
})
export class TopBarWeekCalendarComponent implements OnInit {
  @Input() public player: TrainerModel;
  protected week: string[];
  protected events: CalendarEventModel[][];
  protected version = 0;
  protected dayToNextBattle: string;
  protected nextBattle: CalendarEventModel;

  public constructor(
    protected timeService: TimeService,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected destroyRef: DestroyRef,
    protected playerService: PlayerService,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.timeService
      .getActualDate()
      .pipe(
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
        switchMap((actualDate) => {
          return this.calendarEventQueriesService
            .list({
              custom: {
                trainers: {
                  $in: this.player._id,
                },
                date: {
                  $gte: new Date(actualDate),
                },
                type: CalendarEventEvent.BATTLE,
              },
              limit: 2,
              sort: {
                date: 1,
              },
            })
            .pipe(
              map((result) => {
                return result[0]?.event.winner ? result[1] : result[0];
              }),
              tap((nextBattle) => {
                if (nextBattle) {
                  this.dayToNextBattle = this.getDayToNextBattle(
                    new Date(nextBattle.date),
                    new Date(actualDate)
                  );
                }
                this.nextBattle = nextBattle;
              }),
              map(() => actualDate)
            );
        })
      )
      .subscribe((actualDate) => {
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
        this.week = week;
      });
  }

  protected getDayToNextBattle(battleDate: Date, actualDate: Date): string {
    const diffInMilliseconds = battleDate.getTime() - actualDate.getTime();
    const days = Math.abs(diffInMilliseconds / (1000 * 60 * 60 * 24));
    switch (days) {
      case 0:
        return this.translateService.instant('TODAY');
      case 1:
        return this.translateService.instant('TOMORROW');
      default:
        return this.translateService.instant('IN_X_DAYS', {
          days,
        });
    }
  }
}
