import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../../models/Battle.model';
import { CompleteQuery } from '../../core/complete-query';

@Injectable({
  providedIn: 'root',
})
export class BattleInstanceQueriesService extends CompleteQuery<BattleModel> {
  public static readonly url = 'api/battleInstance';
  public constructor(protected override http: HttpClient) {
    super(BattleInstanceQueriesService.url, http);
  }

  public setWinner(
    battle: BattleModel,
    looserId: string
  ): Observable<BattleModel> {
    battle.winner = looserId === battle.player._id ? 'opponent' : 'player';
    return this.update(battle, battle._id);
  }
}
