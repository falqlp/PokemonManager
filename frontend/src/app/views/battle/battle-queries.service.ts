import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { Observable } from 'rxjs';
import { DamageModel } from '../../models/damage.model';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public readonly calcDamageUrl = 'api/battle/calcDamage';
  public constructor(protected http: HttpClient) {}

  public calcDamage(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): Observable<{ damage: DamageModel; pokemon: PokemonModel }> {
    return this.http.post<{ damage: DamageModel; pokemon: PokemonModel }>(
      this.calcDamageUrl,
      {
        attPokemon,
        defPokemon,
        move,
      }
    );
  }
}
