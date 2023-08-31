const battleCalcService = require("./battle-calc.service");
const battleAiService = require("./battle-ai.service");

const BattleService = {
  getCooldownMs(pokemon) {
    return 6 + 200 / Math.sqrt(pokemon.stats["spe"]);
  },
  simulateBattleTurn(trainer1, trainer2) {
    const { damage1, pokemon1 } = battleCalcService.moveDamage(
      trainer2.pokemons[0],
      trainer1.pokemons[0],
      trainer2.selectedMove
    );
    trainer1.damage = damage1;
    trainer1.pokemons[0] = pokemon1;

    const { damage2, pokemon2 } = battleCalcService.moveDamage(
      trainer1.pokemons[0],
      trainer2.pokemons[0],
      trainer1.selectedMove
    );
    trainer2.damage = damage2;
    trainer2.pokemons[0] = pokemon2;

    if (trainer1.updateDecision) {
      trainer1.decision = battleAiService.decisionMaking(
        trainer2.pokemons[0],
        trainer2.selectedMove,
        trainer1.pokemons
      );
    }
    if (trainer2.updateDecision) {
      trainer2.decision = battleAiService.decisionMaking(
        trainer1.pokemons[0],
        trainer1.selectedMove,
        trainer2.pokemons
      );
    }

    trainer1 = this.changePokemon(trainer1);
    trainer2 = this.changePokemon(trainer2);

    trainer1 = this.moveChange(trainer1);
    trainer2 = this.moveChange(trainer2);

    return { trainer1, trainer2 };
  },

  moveChange(trainer) {
    if (trainer.autorizations.canChangeMove) {
      trainer.selectedMove = trainer.decision.move;
    }
    return trainer;
  },

  changePokemon(trainer) {
    if (
      trainer.autorizations.canChangePokemon &&
      trainer.decision.pokemon !== trainer.pokemons[0]
    ) {
      trainer.pokemons = this.onChangePokemon(trainer);
    }
    return trainer;
  },

  onChangePokemon(trainer) {
    trainer.pokemons[
      trainer.pokemons.findIndex(
        (playerPokemon) => playerPokemon?._id === trainer.decision.pokemon?._id
      )
    ] = trainer.pokemons[0];
    trainer.pokemons[0] = trainer.decision.pokemon;
    return trainer.pokemons;
  },
};
module.exports = BattleService;
