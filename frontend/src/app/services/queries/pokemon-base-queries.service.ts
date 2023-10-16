import { Injectable } from '@angular/core';
import { ReadonlyQuery } from '../../core/readonly-query';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { HttpClient } from '@angular/common/http';
import { WishListModel } from '../../models/nursery.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonBaseQueriesService extends ReadonlyQuery<PokemonBaseModel> {
  public static readonly url = 'api/pokemonBase';

  constructor(protected override http: HttpClient) {
    super(PokemonBaseQueriesService.url, http);
  }

  public generate(wishlist: WishListModel): Observable<void> {
    return this.http.post<void>(
      PokemonBaseQueriesService.url + '/generate',
      wishlist
    );
  }
}
