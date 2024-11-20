import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../../models/Battle.model';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService extends ReadonlyQuery<BattleModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/battle';
  public constructor() {
    const http = inject(HttpClient);

    super(BattleQueriesService.url, http);
    this.http = http;
  }

  public initTrainer(trainerId: string, battleId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/init-trainer`, {
      trainerId,
      battleId,
    });
  }

  public askNextRound(trainerId: string, battleId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/ask-next-round`, {
      trainerId,
      battleId,
    });
  }

  public askNextRoundLoop(
    trainerId: string,
    battleId: string
  ): Observable<void> {
    return this.http.post<void>(`${this.url}/ask-next-round-loop`, {
      trainerId,
      battleId,
    });
  }

  public deleteAskNextRound(
    trainerId: string,
    battleId: string
  ): Observable<void> {
    return this.http.post<void>(`${this.url}/delete-ask-next-round`, {
      trainerId,
      battleId,
    });
  }

  public deleteAskNextRoundLoop(
    trainerId: string,
    battleId: string
  ): Observable<void> {
    return this.http.post<void>(`${this.url}/delete-ask-next-round-loop`, {
      trainerId,
      battleId,
    });
  }

  public resetNextRound(battleId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/reset-next-round-status`, {
      battleId,
    });
  }
}
