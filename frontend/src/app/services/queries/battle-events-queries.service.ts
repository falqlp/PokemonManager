import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BattleEventQueryType,
  DamageEventQueryModel,
  SortOrder,
  StatsByPokemonModel,
} from '../../models/battle-events.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BattleEventsQueriesService {
  public static readonly url = `${environment.apiUrl}/api/battle-events`;
  private http: HttpClient = inject(HttpClient);

  public getBattleEventStats(
    type: BattleEventQueryType,
    isRelative: boolean,
    query?: DamageEventQueryModel,
    sort?: SortOrder
  ): Observable<StatsByPokemonModel[]> {
    return this.http.put<StatsByPokemonModel[]>(
      BattleEventsQueriesService.url,
      {
        type,
        isRelative,
        query,
        sort,
      }
    );
  }
}
