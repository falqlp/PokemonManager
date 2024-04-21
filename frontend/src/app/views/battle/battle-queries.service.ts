import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleTrainerModel, BattleRoundModel } from './battle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public readonly simulateTurnUrl =
    environment.apiUrl + '/api/battle/simulateBattleRound';

  public constructor(protected http: HttpClient) {}

  public simulateTurn(
    battleTrainer1: BattleTrainerModel,
    battleTrainer2: BattleTrainerModel
  ): Observable<BattleRoundModel> {
    return this.http.post<BattleRoundModel>(this.simulateTurnUrl, {
      trainer1: battleTrainer1,
      trainer2: battleTrainer2,
    });
  }
}
