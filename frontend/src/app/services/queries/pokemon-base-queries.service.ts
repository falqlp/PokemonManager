import { Injectable, inject } from '@angular/core';
import { ReadonlyQuery } from '../../core/readonly-query';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PokemonBaseQueriesService extends ReadonlyQuery<PokemonBaseModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/pokemonBase';

  constructor() {
    const http = inject(HttpClient);

    super(PokemonBaseQueriesService.url, http);
    this.http = http;
  }
}
