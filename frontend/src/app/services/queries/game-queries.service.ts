import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { Observable } from 'rxjs';
import { GameModel } from '../../models/game.model';
import { PlayerModel } from '../../models/player.model';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';

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

  public createWithUsers(
    players: PlayerModel[],
    name: string
  ): Observable<GameModel> {
    return this.http.post<GameModel>(this.url + '/' + name, players);
  }

  public addPlayerToGame(
    game: GameModel,
    userId: string
  ): Observable<TrainerModel> {
    return this.http.put<TrainerModel>(this.url + '/add-player-to-game', {
      game,
      userId,
    });
  }
}
