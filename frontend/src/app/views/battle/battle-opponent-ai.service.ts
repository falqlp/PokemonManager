import { Injectable } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { AttackModel } from '../../models/attack.model';
import { DecisionModel } from './battle.model';
import { BattleService } from './battle.service';
import { BehaviorSubject } from 'rxjs';
import { ROUND_TIME_MS } from './battel.const';

@Injectable({
  providedIn: 'root',
})
export class BattleOpponentAiService {
  protected decisionSubject = new BehaviorSubject<DecisionModel>({
    pokemon: undefined,
    attack: undefined,
  });

  public decision$ = this.decisionSubject.asObservable();
  public constructor(protected battleService: BattleService) {}

  public update(
    opponentPokemon: PokemonModel,
    selectedAttack: AttackModel,
    pokemons: PokemonModel[]
  ): void {
    this.decisionMaking(opponentPokemon, selectedAttack, pokemons);
  }

  protected decisionMaking(
    opponentPokemon: PokemonModel,
    selectedAttack: AttackModel,
    pokemons: PokemonModel[]
  ): void {
    let decision: DecisionModel;
    let damageBeforeKO = 0;
    pokemons.forEach((pokemon) => {
      if (pokemon.currentHp !== 0) {
        const opponentDamage = this.battleService.estimator(
          opponentPokemon,
          pokemon,
          selectedAttack
        );
        const changeDamage = this.getChangeDamage(
          pokemons,
          pokemon,
          opponentDamage
        );
        pokemon.attacks.forEach((attack) => {
          const damage = this.battleService.estimator(
            pokemon,
            opponentPokemon,
            attack
          );
          const damageBeforeKOindicator = this.getDamageBeforeKO(
            pokemon,
            opponentDamage,
            damage,
            changeDamage
          );
          if (damageBeforeKOindicator >= damageBeforeKO) {
            damageBeforeKO = damageBeforeKOindicator;
            decision = { pokemon, attack };
          }
        });
      }
    });
    setTimeout(() => {
      this.decisionSubject.next(decision);
    }, 4 * ROUND_TIME_MS);
  }

  protected getDamageBeforeKO(
    pokemon: PokemonModel,
    opponentDamage: number,
    damage: number,
    changeDamage: number
  ): number {
    return Math.abs(
      Math.ceil((pokemon.currentHp - changeDamage) / opponentDamage) * damage
    );
  }

  protected getChangeDamage(
    pokemons: PokemonModel[],
    pokemon: PokemonModel,
    edp: number
  ): number {
    if (pokemon === pokemons[0]) {
      return 0;
    }
    return Math.ceil(this.battleService.getCooldownMs(pokemon) / 500) * edp;
  }
}
