import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../models/Battle.model';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public constructor(protected http: HttpClient) {}

  public create(battle: {
    playerId: string;
    opponentId: string;
  }): Observable<BattleModel> {
    return this.http.post<BattleModel>('api/battle', battle);
  }

  public get(id: string): Observable<BattleModel> {
    return this.http.get<BattleModel>('api/battle/' + id);
  }

  public setWinner(
    battle: BattleModel,
    winnerId: string
  ): Observable<BattleModel> {
    battle.winner = winnerId === battle.player._id ? 'player' : 'opponent';
    return this.http.post<BattleModel>(`api/battle/${battle._id}`, battle);
  }
}
