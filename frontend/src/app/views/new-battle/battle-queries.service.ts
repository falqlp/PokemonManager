import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BattleTrainerModel,
  BattlePokemonModel,
  NewBattleRoundModel,
} from './battle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public readonly simulateBattleRoundUrl =
    environment.apiUrl + '/api/battle/simulateBattleRound';

  public constructor(protected http: HttpClient) {}

  public simulateBattleRound(
    player: BattleTrainerModel,
    opponent: BattleTrainerModel,
    battleOrder: BattlePokemonModel[]
  ): Observable<NewBattleRoundModel> {
    return this.http.post<NewBattleRoundModel>(this.simulateBattleRoundUrl, {
      player,
      opponent,
      battleOrder,
    });
  }
}
