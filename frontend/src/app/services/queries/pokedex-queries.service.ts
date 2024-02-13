import { Injectable } from '@angular/core';
import { ReadonlyQuery } from '../../core/readonly-query';
import { HttpClient } from '@angular/common/http';
import { PokedexDetailsModel } from '../../views/pokedex-details/pokedex-details.model';

@Injectable({
  providedIn: 'root',
})
export class PokedexQueriesService extends ReadonlyQuery<PokedexDetailsModel> {
  public static readonly url = 'api/pokedex';
  constructor(http: HttpClient) {
    super(PokedexQueriesService.url, http);
  }
}
