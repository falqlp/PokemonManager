import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleTrainerModel, BattleRoundModel } from './battle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public readonly simulateBattleRoundUrl =
    environment.apiUrl + '/api/battle/simulateBattleRound';

  public constructor(protected http: HttpClient) {}

  public simulateBattleRound(
    battleTrainer1: BattleTrainerModel,
    battleTrainer2: BattleTrainerModel
  ): Observable<BattleRoundModel> {
    return this.http.post<BattleRoundModel>(this.simulateBattleRoundUrl, {
      trainer1: battleTrainer1,
      trainer2: battleTrainer2,
    });
  }
}
