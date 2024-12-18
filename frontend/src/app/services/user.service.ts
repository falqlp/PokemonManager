import { inject, Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { UserQueriesService } from './queries/user-queries.service';
import { EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { Languages, UserModel } from '../models/user.model';
import { WebsocketEventService } from './websocket-event.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private cacheService = inject(CacheService);
  private userQueriesService = inject(UserQueriesService);
  private websocketEventService = inject(WebsocketEventService);
  private languageService = inject(LanguageService);

  public $user: Observable<UserModel>;
  constructor() {
    this.$user = this.cacheService.$userId.pipe(
      switchMap((id) => {
        return this.websocketEventService.updateUserEvent$.pipe(map(() => id));
      }),
      switchMap((id) => {
        if (!id || id === 'undefined') {
          return EMPTY;
        }
        return this.userQueriesService.get(id);
      }),
      tap((user) => {
        this.languageService.setLanguage(
          user.lang === Languages.FR || user.lang.toString() === 'fr'
            ? Languages.FR
            : Languages.EN
        );
      })
    );
  }
}
