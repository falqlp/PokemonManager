const battleCalcService = require("./battle-calc.service");
const battleAiService = require("./battle-ai.service");

const BattleService = {
  simulateBattleTurn(trainer1, trainer2) {
    this.decreseCooldown(trainer1);
    this.decreseCooldown(trainer2);

    trainer1.damage = battleCalcService.calcDamage(
      trainer2.pokemons[0],
      trainer1.pokemons[0],
      trainer2.selectedMove
    );

    trainer2.damage = battleCalcService.calcDamage(
      trainer1.pokemons[0],
      trainer2.pokemons[0],
      trainer1.selectedMove
    );

    trainer1.pokemons[0] = battleCalcService.damageOnPokemon(
      trainer1.pokemons[0],
      trainer1.damage
    );
    trainer2.pokemons[0] = battleCalcService.damageOnPokemon(
      trainer2.pokemons[0],
      trainer2.damage
    );

    this.onPokemonKo(trainer1);
    this.onPokemonKo(trainer2);

    if (trainer1.updateDecision) {
      trainer1.decision = battleAiService.decisionMaking(
        trainer2.pokemons[0],
        trainer2.selectedMove,
        trainer1.pokemons
      );
      trainer1.updateDecision = false;
    }
    if (trainer2.updateDecision) {
      trainer2.decision = battleAiService.decisionMaking(
        trainer1.pokemons[0],
        trainer1.selectedMove,
        trainer2.pokemons
      );
      trainer2.updateDecision = false;
    }

    trainer1 = this.changePokemon(trainer1, trainer2);
    trainer2 = this.changePokemon(trainer2, trainer1);

    trainer1 = this.moveChange(trainer1, trainer2);
    trainer2 = this.moveChange(trainer2, trainer1);

    return { trainer1, trainer2 };
  },

  moveChange(trainer, opp) {
    if (
      trainer.autorizations.moveCooldown === 0 &&
      trainer.selectedMove?.name !== trainer.decision.move.name
    ) {
      trainer.selectedMove = trainer.decision.move;
      opp.updateDecision = true;
      trainer.autorizations.moveCooldown = battleCalcService.getCooldownTurn(
        trainer.pokemons[0]
      );
    }
    return trainer;
  },

  changePokemon(trainer, opp) {
    if (
      trainer.autorizations.pokemonCooldown === 0 &&
      trainer.decision.pokemon._id !== trainer.pokemons[0]._id
    ) {
      trainer.pokemons = this.onChangePokemon(trainer);
      opp.updateDecision = true;
      trainer.autorizations.pokemonCooldown = battleCalcService.getCooldownTurn(
        trainer.pokemons[0]
      );
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

  decreseCooldown(trainer) {
    if (trainer.autorizations.moveCooldown < 0) {
      trainer.autorizations.moveCooldown -= 1;
    }
    if (trainer.autorizations.pokemonCooldown < 0) {
      trainer.autorizations.pokemonCooldown -= 1;
    }
  },

  onPokemonKo(trainer) {
    if (trainer.pokemons[0].currentHp === 0) {
      if (trainer.pokemons.some((pokemon) => pokemon.currentHp !== 0)) {
        trainer.autorizations.pokemonCooldown = 0;
        trainer.autorizations.moveCooldown = 0;
        trainer.updateDecision = true;
      } else {
        trainer.defeat = true;
      }
    }
  },
};
module.exports = BattleService;
