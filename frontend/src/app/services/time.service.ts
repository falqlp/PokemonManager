import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';
import { GameQueriesService } from './queries/game-queries.service';
import { CacheService } from './cache.service';
import { WebsocketEventService } from './websocket-event.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private gameQueriesService = inject(GameQueriesService);
  private cacheService = inject(CacheService);
  private languageService = inject(LanguageService);
  private websocketEventService = inject(WebsocketEventService);

  protected actualDate: Date = null;

  protected newDaySubject: BehaviorSubject<void> = new BehaviorSubject(null);
  protected $newDay = this.newDaySubject.asObservable();

  protected actualDaySubject = new BehaviorSubject(this.actualDate);

  public constructor() {
    this.cacheService.$gameId
      .pipe(
        switchMap((gameId) => {
          return this.websocketEventService.updateGameEvent$.pipe(
            map(() => gameId)
          );
        }),
        switchMap((gameId) => {
          if (gameId && gameId !== 'undefined') {
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
    return this.languageService.getLanguage().pipe(
      switchMap((lang) => {
        return this.getActualDate().pipe(
          map((date) => this.dateToLocalDate(date, lang))
        );
      })
    );
  }

  public getActualDate(): Observable<Date> {
    return this.actualDaySubject.asObservable().pipe(filter((date) => !!date));
  }

  public dateToLocalDate(date: Date, local: string): string {
    if (!date) {
      return '';
    }
    return date.toLocaleString(local, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }

  public dateToSimplifyLocalDate(date: Date): string {
    return date.toLocaleString(this.languageService.getCurrentLang(), {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long',
    });
  }

  public updateDate(newDate: Date): void {
    this.actualDaySubject.next(newDate);
    this.newDaySubject.next();
  }

  public newDateEvent(): Observable<void> {
    return this.$newDay;
  }
}
