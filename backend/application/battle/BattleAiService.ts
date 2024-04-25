import { IPokemon } from "../../domain/pokemon/Pokemon";
import BattleCalcService from "./BattleCalcService";
import { IBattleMove, IBattlePokemon, IDecision } from "./BattleInterfaces";
import { singleton } from "tsyringe";

@singleton()
class BattleAiService {
  constructor(protected battleService: BattleCalcService) {}

  decisionMaking(
    opponentPokemon: IBattlePokemon,
    pokemons: IBattlePokemon[],
  ): IDecision {
    const opponentMoves = opponentPokemon.moves.filter(
      (move: IBattleMove) => move.used,
    );
    if (opponentMoves.length === 0) {
      return this.noSelectedMoveDecision(pokemons[0], opponentPokemon);
    }
    let decision;
    let damageBeforeKO = -1;
    pokemons.forEach((pokemon) => {
      if (pokemon.currentHp !== 0) {
        opponentMoves.forEach((opponentMove) => {
          let opponentDamage = 0;
          let changeDamage = 0;
          opponentDamage = this.battleService.estimator(
            opponentPokemon,
            pokemon,
            opponentMove,
          );
          changeDamage = this.getChangeDamage(
            pokemons,
            pokemon,
            opponentDamage,
          );
          pokemon.moves.forEach((move) => {
            const damage = this.battleService.estimator(
              pokemon,
              opponentPokemon,
              move,
            );
            const damageBeforeKOindicator = this.getDamageBeforeKoAsFullLife(
              pokemon,
              opponentDamage,
              damage,
              changeDamage,
            );
            if (damageBeforeKOindicator >= damageBeforeKO) {
              damageBeforeKO = damageBeforeKOindicator;
              decision = { pokemon, move };
            }
          });
        });
      }
    });
    return decision;
  }

  noSelectedMoveDecision(
    pokemon: IBattlePokemon,
    oppPokemon: IBattlePokemon,
  ): IDecision {
    let maxDamage = 0;
    let bestMove;
    pokemon.moves.forEach((move) => {
      const estimator = this.battleService.estimator(pokemon, oppPokemon, move);
      if (estimator >= maxDamage) {
        bestMove = move;
        maxDamage = estimator;
      }
    });
    return { pokemon, move: bestMove };
  }

  getDamageBeforeKoAsFullLife(
    pokemon: IPokemon,
    opponentDamage: number,
    damage: number,
    changeDamage: number,
  ): number {
    return Math.abs(
      Math.ceil((pokemon.stats.hp - changeDamage) / opponentDamage) * damage,
    );
  }

  getChangeDamage(
    pokemons: IPokemon[],
    pokemon: IPokemon,
    edp: number,
  ): number {
    if (pokemon._id === pokemons[0]._id) {
      return 0;
    }
    return this.battleService.getCooldownTurn(pokemon) * edp;
  }
}
export default BattleAiService;
