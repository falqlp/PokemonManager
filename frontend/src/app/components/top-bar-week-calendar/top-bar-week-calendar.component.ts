import { Component, DestroyRef, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-top-bar-week-calendar',
  templateUrl: './top-bar-week-calendar.component.html',
  styleUrls: ['./top-bar-week-calendar.component.scss'],
  imports: [NgForOf, AsyncPipe, NgClass],
})
export class TopBarWeekCalendarComponent implements OnInit {
  protected data$: Observable<string[]>;
  protected version = 0;
  protected actualDate: string;

  public constructor(
    protected timeService: TimeService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.data$ = this.timeService.getActualDate().pipe(
      takeUntilDestroyed(this.destroyRef),
      map((actualDate) => {
        this.actualDate = this.timeService.dateToLocalDate(actualDate);
        this.version += 1;
        const week: string[] = [];
        const newDate = new Date(actualDate);
        newDate.setDate(newDate.getDate() - 1);
        for (let i = 0; i < 7; i++) {
          week[i] = `${this.timeService.dateToLocalDate(newDate)}-${
            this.version
          }`;
          newDate.setDate(newDate.getDate() + 1);
        }
        return week;
      })
    );
  }
}
