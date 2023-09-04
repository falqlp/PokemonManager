const battleCalcService = require("./battle-calc.service");
const battleAiService = require("./battle-ai.service");

const BattleService = {
  simulateBattleRound(trainer1, trainer2) {
    [trainer1, trainer2] = this.initializeTrainers(trainer1, trainer2);
    this.decreseCooldown(trainer1);
    this.decreseCooldown(trainer2);
    this.processDamage(trainer1, trainer2);
    this.checkPokemonKo(trainer1);
    this.checkPokemonKo(trainer2);
    this.updateDecision(trainer1, trainer2);
    trainer1 = this.applyDecision(trainer1, trainer2);
    trainer2 = this.applyDecision(trainer2, trainer1);
    return { trainer1, trainer2 };
  },
  initializeTrainers(trainer1, trainer2) {
    trainer1.onKo = trainer2.onKo = false;
    trainer1.damage = trainer2.damage = null;
    return [trainer1, trainer2];
  },
  processDamage(trainer1, trainer2) {
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
  },
  checkPokemonKo(trainer) {
    if (trainer.pokemons[0].currentHp === 0) {
      trainer.onKo = true;
      trainer.defeat = !trainer.pokemons.some(
        (pokemon) => pokemon.currentHp !== 0
      );
      if (!trainer.defeat) {
        trainer.autorizations = this.resetCooldowns();
      }
    }
  },
  resetCooldowns() {
    return {
      pokemonCooldown: 0,
      moveCooldown: 0,
      updateCooldown: 0,
    };
  },
  updateDecision(trainer1, trainer2) {
    if (trainer1.autorizations.updateCooldown === 0) {
      trainer1.decision = battleAiService.decisionMaking(
        trainer2.pokemons[0],
        trainer2.selectedMove,
        trainer1.pokemons
      );
    }
    if (trainer2.autorizations.updateCooldown === 0) {
      trainer2.decision = battleAiService.decisionMaking(
        trainer1.pokemons[0],
        trainer1.selectedMove,
        trainer2.pokemons
      );
    }
  },
  applyDecision(trainer, opponent) {
    trainer = this.changePokemon(trainer, opponent);
    trainer = this.moveChange(trainer, opponent);
    return trainer;
  },

  moveChange(trainer, opp) {
    if (
      !trainer.defeat &&
      trainer.autorizations.moveCooldown === 0 &&
      trainer.selectedMove?.name !== trainer.decision.move.name
    ) {
      trainer.selectedMove = trainer.decision.move;
      opp.autorizations.updateCooldown = 3;
      trainer.autorizations.moveCooldown = battleCalcService.getCooldownTurn(
        trainer.pokemons[0]
      );
    }
    return trainer;
  },

  changePokemon(trainer, opp) {
    if (
      !trainer.defeat &&
      trainer.autorizations.pokemonCooldown === 0 &&
      trainer.decision.pokemon._id !== trainer.pokemons[0]._id
    ) {
      trainer.pokemons = this.onChangePokemon(trainer);
      trainer.selectedMove = undefined;
      opp.autorizations.updateCooldown = 3;
      trainer.autorizations.pokemonCooldown = trainer.onKo
        ? 0
        : battleCalcService.getCooldownTurn(trainer.pokemons[0]);
      trainer.autorizations.moveCooldown = trainer.onKo
        ? 0
        : battleCalcService.getCooldownTurn(trainer.pokemons[0]);
    }
    return trainer;
  },

  onChangePokemon(trainer) {
    const newLeadingPokemon = trainer.pokemons.find(
      (playerPokemon) => playerPokemon?._id === trainer.decision.pokemon?._id
    );
    trainer.pokemons[
      trainer.pokemons.findIndex(
        (playerPokemon) => playerPokemon?._id === trainer.decision.pokemon?._id
      )
    ] = trainer.pokemons[0];
    trainer.pokemons[0] = newLeadingPokemon;
    return trainer.pokemons;
  },

  decreseCooldown(trainer) {
    if (trainer.autorizations.moveCooldown > 0) {
      trainer.autorizations.moveCooldown -= 1;
    }
    if (trainer.autorizations.pokemonCooldown > 0) {
      trainer.autorizations.pokemonCooldown -= 1;
    }
    if (trainer.autorizations.updateCooldown > 0) {
      trainer.autorizations.updateCooldown -= 1;
    }
  },
};
module.exports = BattleService;
