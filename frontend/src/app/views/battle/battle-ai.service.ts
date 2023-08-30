import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { DecisionModel } from './battle.model';
import { BattleService } from './battle.service';
import { BehaviorSubject } from 'rxjs';
import { ROUND_TIME_MS } from './battel.const';

export class BattleAiService {
  protected decisionSubject = new BehaviorSubject<DecisionModel>({
    pokemon: undefined,
    move: undefined,
  });

  public decision$ = this.decisionSubject.asObservable();
  public constructor(protected battleService: BattleService) {}

  public update(
    opponentPokemon: PokemonModel,
    selectedMove: MoveModel,
    pokemons: PokemonModel[]
  ): void {
    this.decisionMaking(opponentPokemon, selectedMove, pokemons);
  }

  protected decisionMaking(
    opponentPokemon: PokemonModel,
    selectedMove: MoveModel,
    pokemons: PokemonModel[]
  ): void {
    let decision: DecisionModel;
    let damageBeforeKO = 0;
    pokemons.forEach((pokemon) => {
      if (pokemon.currentHp !== 0) {
        let opponentDamage = 0;
        let changeDamage = 0;
        if (selectedMove) {
          opponentDamage = this.battleService.estimator(
            opponentPokemon,
            pokemon,
            selectedMove
          );
          changeDamage = this.getChangeDamage(
            pokemons,
            pokemon,
            opponentDamage
          );
        }
        pokemon.moves.forEach((move) => {
          const damage = this.battleService.estimator(
            pokemon,
            opponentPokemon,
            move
          );
          const damageBeforeKOindicator = this.getDamageBeforeKO(
            pokemon,
            opponentDamage,
            damage,
            changeDamage
          );
          if (damageBeforeKOindicator >= damageBeforeKO) {
            damageBeforeKO = damageBeforeKOindicator;
            decision = { pokemon, move };
          }
        });
      }
    });
    setTimeout(() => {
      // if (decision.pokemon.basePokemon.name === 'CARRACOSTA') {
      //   console.log(decision.pokemon);
      // }
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
    if (pokemon._id === pokemons[0]._id) {
      return 0;
    }
    return (
      Math.ceil(this.battleService.getCooldownMs(pokemon) / ROUND_TIME_MS) * edp
    );
  }
}
