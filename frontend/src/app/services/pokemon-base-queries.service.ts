import { Injectable } from '@angular/core';
import { ReadonlyQuery } from './readonly-query';
import { PokemonBaseModel } from '../models/PokemonModels/pokemonBase.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PokemonBaseQueriesService extends ReadonlyQuery<PokemonBaseModel> {
  public static readonly url = 'api/pokemonBase';

  constructor(protected override http: HttpClient) {
    super(PokemonBaseQueriesService.url, http);
  }
}
