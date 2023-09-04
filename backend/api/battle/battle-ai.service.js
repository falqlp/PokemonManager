const battleService = require("./battle-calc.service");
const ROUND_TIME_MS = 500;

const BattleAiService = {
  decisionMaking(opponentPokemon, selectedMove, pokemons) {
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
  },

  noSelectedMoveDecision(pokemon, oppPokemon) {
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
  },

  getDamageBeforeKO(pokemon, opponentDamage, damage, changeDamage) {
    return Math.abs(
      Math.ceil((pokemon.currentHp - changeDamage) / opponentDamage) * damage
    );
  },
  getChangeDamage(pokemons, pokemon, edp) {
    if (pokemon._id === pokemons[0]._id) {
      return 0;
    }
    return (
      Math.ceil(battleService.getCooldownMs(pokemon) / ROUND_TIME_MS) * edp
    );
  },
};
module.exports = BattleAiService;
