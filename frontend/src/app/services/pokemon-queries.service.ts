import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { PokemonModel } from '../models/PokemonModels/pokemon.model';
import { CompleteQuery } from './complete-query';

@Injectable({
  providedIn: 'root',
})
export class PokemonQueriesService extends CompleteQuery<PokemonModel> {
  public static readonly url = 'api/pokemon';
  constructor(protected override http: HttpClient) {
    super(PokemonQueriesService.url, http);
  }
}
