import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { Observable } from 'rxjs';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class PokemonQueriesService extends ReadonlyQuery<PokemonModel> {
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

  public getStarters(playerId: string): Observable<PokemonModel[]> {
    return this.http.get<PokemonModel[]>(this.url + '/starters/' + playerId);
  }

  public createStarters(starters: PokemonModel[]): Observable<void> {
    return this.http.post<void>(this.url + '/starters', { starters });
  }

  public changeNickname(pokemonId: string, nickname: string): Observable<void> {
    return this.http.put<void>(this.url + '/changeNickname', {
      pokemonId,
      nickname,
    });
  }

  public modifyMoves(
    pokemonId: string,
    movesId: string[],
    trainerId: string
  ): Observable<void> {
    return this.http.put<void>(this.url + '/modify-moves', {
      pokemonId,
      movesId,
      trainerId,
    });
  }

  public modifyStrategy(
    strategies: {
      pokemonId: string;
      strategy: number[];
    }[],
    trainerId: string
  ): Observable<void> {
    return this.http.put<void>(this.url + '/modify-strategy', {
      strategies,
      trainerId,
    });
  }

  public modifyBattleStrategy(
    strategies: {
      pokemonId: string;
      strategy: number[];
    }[],
    trainerId: string
  ): Observable<void> {
    return this.http.put<void>(this.url + '/modify-battle-strategy', {
      strategies,
      trainerId,
    });
  }

  public hatchEgg(pokemonId: string): Observable<void> {
    return this.http.put<void>(this.url + '/hatch-egg', {
      pokemonId,
    });
  }

  public evolve(pokemonId: string): Observable<void> {
    return this.http.put<void>(this.url + '/evolve', {
      pokemonId,
    });
  }

  public release(pokemonId: string): Observable<void> {
    return this.http.delete<void>(this.url + '/release/' + pokemonId);
  }
}
