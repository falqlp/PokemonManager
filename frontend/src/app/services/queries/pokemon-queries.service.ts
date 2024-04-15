import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { CompleteQuery } from '../../core/complete-query';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonQueriesService extends CompleteQuery<PokemonModel> {
  public static readonly url = 'api/pokemon';
  constructor(protected override http: HttpClient) {
    super(PokemonQueriesService.url, http);
  }

  public getEffectiveness(types: string[]): Observable<Record<string, number>> {
    return this.http.put<Record<string, number>>(
      this.url + '/effectiveness',
      types
    );
  }

  public getStarters(): Observable<PokemonModel[]> {
    return this.http.get<PokemonModel[]>(this.url + '/starters');
  }
}
