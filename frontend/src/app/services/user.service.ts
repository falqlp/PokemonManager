import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { UserQueriesService } from './queries/user-queries.service';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { WebsocketEventService } from './websocket-event.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public $user: Observable<UserModel>;
  constructor(
    private cacheService: CacheService,
    private userQueriesService: UserQueriesService,
    private websocketEventService: WebsocketEventService
  ) {
    this.$user = this.cacheService.$userId.pipe(
      switchMap((id) => {
        return this.websocketEventService.updateUserEvent$.pipe(map(() => id));
      }),
      switchMap((id) => {
        if (!id || id === 'undefined') {
          return EMPTY;
        }
        return this.userQueriesService.get(id);
      })
    );
  }
}
