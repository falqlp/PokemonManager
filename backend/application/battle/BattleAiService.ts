import battleService from "./BattleCalcService";
import { IPokemon } from "../../api/pokemon/Pokemon";
import { IMove } from "../../api/move/Move";

class BattleAiService  {
  private static instance: BattleAiService;

  public static getInstance(): BattleAiService {
    if (!BattleAiService.instance) {
      BattleAiService.instance = new BattleAiService();
    }
    return BattleAiService.instance;
  }

  decisionMaking(
    opponentPokemon: IPokemon,
    selectedMove: IMove,
    pokemons: IPokemon[]
  ) {
    if (selectedMove === undefined) {
      return this.noSelectedMoveDecision(pokemons[0], opponentPokemon);
    }
    let decision;
    let damageBeforeKO = 0;
    pokemons.forEach((pokemon) => {
      if (pokemon.currentHp !== 0) {
        let opponentDamage = 0;
        let changeDamage = 0;
        opponentDamage = battleService.estimator(
          opponentPokemon,
          pokemon,
          selectedMove
        );
        changeDamage = this.getChangeDamage(pokemons, pokemon, opponentDamage);
        pokemon.moves.forEach((move) => {
          const damage = battleService.estimator(
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
    return decision;
  };

  noSelectedMoveDecision(pokemon: IPokemon, oppPokemon: IPokemon) {
    let maxDamage = 0;
    let bestMove;
    pokemon.moves.forEach((move) => {
      const estimator = battleService.estimator(pokemon, oppPokemon, move);
      if (estimator >= maxDamage) {
        bestMove = move;
        maxDamage = estimator;
      }
    });
    return { pokemon, move: bestMove };
  }

  getDamageBeforeKO(
    pokemon: IPokemon,
    opponentDamage: number,
    damage: number,
    changeDamage: number
  ) {
    return Math.abs(
      Math.ceil((pokemon.currentHp - changeDamage) / opponentDamage) * damage
    );
  };
  getChangeDamage(pokemons: IPokemon[], pokemon: IPokemon, edp: number) {
    if (pokemon._id === pokemons[0]._id) {
      return 0;
    }
    return battleService.getCooldownTurn(pokemon) * edp;
  };
}
export default BattleAiService;
