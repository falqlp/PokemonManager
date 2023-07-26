import { Injectable } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { AttackModel } from '../../models/attack.model';
import { DecisionModel } from './battle.model';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { BattleService } from './battle.service';

@Injectable({
  providedIn: 'root',
})
export class BattleOpponentAiService {
  protected pokemons: PokemonModel[];
  protected attacks: AttackModel[];
  public decision: DecisionModel = { attack: undefined, pokemon: undefined };
  public constructor(protected battleService: BattleService) {}

  public init(trainer: TrainerModel): void {
    this.pokemons = trainer.pokemons;
    this.attacks = this.pokemons[0].attacks;
  }

  protected getAttack(): void {
    this.decision.attack = this.attacks[0];
  }

  public update(
    opponentPokemon: PokemonModel,
    selectedAttack: AttackModel
  ): void {
    this.getAttack();
    this.decisionMaking(opponentPokemon, selectedAttack);
  }

  protected decisionMaking(
    opponentPokemon: PokemonModel,
    selectedAttack: AttackModel
  ): void {
    let decision: DecisionModel;
    let damageBeforeKO = 0;
    this.pokemons.forEach((pokemon) => {
      const opponentDamage = this.battleService.estimator(
        opponentPokemon,
        pokemon,
        selectedAttack
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
          damage
        );
        if (damageBeforeKOindicator > damageBeforeKO) {
          damageBeforeKO = damageBeforeKOindicator;
          decision = { pokemon, attack };
        }
      });
    });
    console.log(decision);
  }

  protected getDamageBeforeKO(
    pokemon: PokemonModel,
    opponentDamage: number,
    damage: number
  ): number {
    return Math.ceil(pokemon.currentHp / opponentDamage) * damage;
  }
}
