import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { Observable } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { GameModel } from '../../models/game.model';

@Injectable({
  providedIn: 'root',
})
export class GameQueriesService extends CompleteQuery<GameModel> {
  public static readonly url = 'api/game';
  public constructor(protected override http: HttpClient) {
    super(GameQueriesService.url, http);
  }

  public getPlayer(gameId: string): Observable<TrainerModel> {
    return this.http.get<TrainerModel>(
      GameQueriesService.url + '/player/' + gameId
    );
  }

  public getTime(gameId: string): Observable<Date> {
    return this.http.get<Date>(GameQueriesService.url + '/time/' + gameId);
  }
}
