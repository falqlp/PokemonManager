import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { GameQueriesService } from './queries/game-queries.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  protected actualDate: Date = null;
  protected actualDaySubjectToString: BehaviorSubject<string> =
    new BehaviorSubject(this.dateToLocalDate(this.actualDate));

  protected newDaySubject: BehaviorSubject<void> = new BehaviorSubject(null);
  protected $newDay = this.newDaySubject.asObservable();

  protected actualDaySubject = new BehaviorSubject(this.actualDate);

  public constructor(
    protected gameQueriesService: GameQueriesService,
    protected cacheService: CacheService
  ) {
    this.cacheService.$gameId
      .pipe(
        switchMap((gameId) => {
          if (gameId) {
            return this.gameQueriesService.getTime(gameId);
          }
          return of(null);
        })
      )
      .subscribe((actualDate) => {
        this.actualDate = new Date(actualDate);
        this.updateDate(this.actualDate);
      });
  }

  public getActualDateToString(): Observable<string> {
    return this.actualDaySubjectToString.asObservable();
  }

  public getActualDate(): Observable<Date> {
    return this.actualDaySubject.asObservable();
  }

  public dateToLocalDate(date: Date): string {
    if (!date) {
      return '';
    }
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }

  public dateToSimplifyLocalDate(date: Date): string {
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
    });
  }

  public updateDate(newDate: Date): void {
    this.actualDaySubjectToString.next(this.dateToLocalDate(newDate));
    this.actualDaySubject.next(newDate);
    this.newDaySubject.next();
  }

  public newDateEvent(): Observable<void> {
    return this.$newDay;
  }
}
