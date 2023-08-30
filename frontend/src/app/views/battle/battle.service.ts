import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import type { MoveModel } from '../../models/move.model';
import { STAB_MODIFIER, TYPE_EFFECTIVENESS } from './battel.const';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public calcDamageBase(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): number {
    if (move.category === 'status' || move.power === 0) {
      return 0;
    }
    let pokemonAtt: number;
    let pokemonDef: number;
    if (move.category === 'physical') {
      pokemonAtt = attPokemon.stats['atk'];
      pokemonDef = defPokemon.stats['def'];
    } else if (move.category === 'special') {
      pokemonAtt = attPokemon.stats['spAtk'];
      pokemonDef = defPokemon.stats['spDef'];
    }
    return (
      (attPokemon.level * 0.4 * pokemonAtt * move.power) / pokemonDef / 50 + 2
    );
  }

  public calcEffectivness(move: MoveModel, defPokemon: PokemonModel): number {
    let modifier = 1;
    defPokemon.basePokemon.types.forEach((type) => {
      if (TYPE_EFFECTIVENESS[move.type][type] !== undefined) {
        modifier *= TYPE_EFFECTIVENESS[move.type][type];
      }
    });
    return modifier;
  }

  public stab(move: MoveModel, attPokemon: PokemonModel): number {
    let modifier = 1;
    attPokemon.basePokemon.types.forEach((type) => {
      if (type === move.type) {
        modifier = STAB_MODIFIER;
      }
    });
    return modifier;
  }

  public estimator(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): number {
    return (
      this.calcDamageBase(attPokemon, defPokemon, move) *
      this.calcEffectivness(move, defPokemon) *
      this.stab(move, attPokemon) *
      (move.accuracy / 100)
    );
  }

  public getCooldownMs(pokemon: PokemonModel): number {
    return 6 + 200 / Math.sqrt(pokemon.stats['spe']);
  }
}
