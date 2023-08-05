import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../models/Battle.model';
import { CompleteQuery } from './complete-query';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService extends CompleteQuery<BattleModel> {
  public static readonly url = 'api/battle';
  public constructor(protected override http: HttpClient) {
    super(BattleQueriesService.url, http);
  }

  public setWinner(
    battle: BattleModel,
    looserId: string
  ): Observable<BattleModel> {
    battle.winner = looserId === battle.player._id ? 'opponent' : 'player';
    return this.update(battle, battle._id);
  }
}
