import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BattleModel } from '../../models/Battle.model';
import { RankingModel, SerieRankingModel } from '../../models/ranking.model';
import { ReadonlyQuery } from '../../core/readonly-query';
import { SessionStorageService } from '../session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BattleInstanceQueriesService extends ReadonlyQuery<BattleModel> {
  protected override http: HttpClient;
  private readonly sessionStorageService = inject(SessionStorageService);

  public static readonly url = 'api/battle-instance';
  public constructor() {
    const http = inject(HttpClient);

    super(BattleInstanceQueriesService.url, http);
    this.http = http;
  }

  public getRanking(competitionId: string): Observable<RankingModel[]> {
    return this.http
      .get<RankingModel[]>(`${this.url}/ranking/${competitionId}`)
      .pipe(
        tap((r: RankingModel[]) => {
          this.sessionStorageService.updateCompetitionRanking(r, competitionId);
        })
      );
  }

  public getGroupsRanking(competitionId: string): Observable<RankingModel[][]> {
    return this.http
      .get<RankingModel[][]>(`${this.url}/groups-ranking/${competitionId}`)
      .pipe(
        tap((r: RankingModel[][]) => {
          this.sessionStorageService.updateGroupRanking(r, competitionId);
        })
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
}
