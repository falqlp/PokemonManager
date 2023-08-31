import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public getCooldownMs(pokemon: PokemonModel): number {
    return 6 + 200 / Math.sqrt(pokemon.stats['spe']);
  }
}
