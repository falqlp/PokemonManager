import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BattleModel } from '../models/Battle.model';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public constructor(protected http: HttpClient) {}

  public create(battle: BattleModel): Observable<BattleModel> {
    return this.http.post<BattleModel>('api/battle', battle);
  }

  public get(id: string): Observable<BattleModel> {
    return this.http.get<BattleModel>('api/battle/' + id);
  }
}
