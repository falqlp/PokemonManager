import { inject, Injectable } from '@angular/core';
import { ReadonlyQuery } from '../../core/readonly-query';
import { HttpClient } from '@angular/common/http';
import { PokedexDetailsModel } from '../../views/play/pokedex-details/pokedex-details.model';

@Injectable({
  providedIn: 'root',
})
export class PokedexQueriesService extends ReadonlyQuery<PokedexDetailsModel> {
  public static readonly url = 'api/pokedex';
  constructor() {
    const http = inject(HttpClient);

    super(PokedexQueriesService.url, http);
  }
}
