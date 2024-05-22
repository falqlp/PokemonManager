import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../../models/Battle.model';
import { CompleteQuery } from '../../core/complete-query';
import { RankingModel, SerieRankingModel } from '../../models/ranking.model';

@Injectable({
  providedIn: 'root',
})
export class BattleInstanceQueriesService extends CompleteQuery<BattleModel> {
  public static readonly url = 'api/battleInstance';
  public constructor(protected override http: HttpClient) {
    super(BattleInstanceQueriesService.url, http);
  }

  public getRanking(competitionId: string): Observable<RankingModel[]> {
    return this.http.get<RankingModel[]>(
      `${this.url}/ranking/${competitionId}`
    );
  }

  public getGroupsRanking(competitionId: string): Observable<RankingModel[][]> {
    return this.http.get<RankingModel[][]>(
      `${this.url}/groups-ranking/${competitionId}`
    );
  }

  public getTournamentRanking(
    tournamentId: string
  ): Observable<{ tournamentRanking: SerieRankingModel[][]; step: number }> {
    return this.http.get<{
      tournamentRanking: SerieRankingModel[][];
      step: number;
    }>(`${this.url}/tournament-ranking/${tournamentId}`);
  }

  public simulateBattle(battle: BattleModel): Observable<BattleModel> {
    return this.http.post<BattleModel>(`${this.url}/simulateBattle`, {
      _id: battle._id,
    });
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
