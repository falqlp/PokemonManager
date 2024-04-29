import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../../models/Battle.model';
import { CompleteQuery } from '../../core/complete-query';
import { RankingModel } from '../../models/ranking.model';
import {
  BattlePokemonModel,
  BattleTrainerModel,
} from '../../views/new-battle/battle.model';

@Injectable({
  providedIn: 'root',
})
export class BattleInstanceQueriesService extends CompleteQuery<BattleModel> {
  public static readonly url = 'api/battleInstance';
  public constructor(protected override http: HttpClient) {
    super(BattleInstanceQueriesService.url, http);
  }

  public setWinner(
    battleId: string,
    looserId: string,
    playerId: string
  ): Observable<BattleModel> {
    const battle = {
      _id: battleId,
      winner: looserId === playerId ? 'opponent' : 'player',
    } as BattleModel;
    return this.update(battle, battle._id);
  }

  public getRanking(competitionId: string): Observable<RankingModel[]> {
    return this.http.get<RankingModel[]>(
      `${this.url}/ranking/${competitionId}`
    );
  }

  public simulateBattle(battle: BattleModel): Observable<BattleModel> {
    return this.http.post<BattleModel>(`${this.url}/simulateBattle`, {
      _id: battle._id,
    });
  }

  public initBattle(battleId: string): Observable<{
    player: BattleTrainerModel;
    opponent: BattleTrainerModel;
    battleOrder: BattlePokemonModel[];
  }> {
    return this.http.get<{
      player: BattleTrainerModel;
      opponent: BattleTrainerModel;
      battleOrder: BattlePokemonModel[];
    }>(`${this.url}/init-battle/${battleId}`);
  }
}
