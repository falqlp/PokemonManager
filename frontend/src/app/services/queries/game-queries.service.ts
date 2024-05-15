import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { Observable } from 'rxjs';
import { GameModel } from '../../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameQueriesService extends CompleteQuery<GameModel> {
  public static readonly url = 'api/game';
  public constructor(protected override http: HttpClient) {
    super(GameQueriesService.url, http);
  }

  public getTime(gameId: string): Observable<Date> {
    return this.http.get<Date>(this.url + '/time/' + gameId);
  }

  public createWithUser(
    game: GameModel,
    userId: string
  ): Observable<GameModel> {
    return this.http.post<GameModel>(this.url + '/' + userId, game);
  }

  public initGame(playerId: string): Observable<void> {
    return this.http.post<void>(this.url + '/init-game', { playerId });
  }
}
