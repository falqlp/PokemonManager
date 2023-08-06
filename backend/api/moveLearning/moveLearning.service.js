const MoveLearning = require("./moveLearning");
const moveService = require("../move/move.service");
const evolutionService = require("../evolution/evolution.service");

const MoveLearningService = {
  learnableMoves: async function (pokemon) {
    const allMoves = await this.getMovesOfAllEvolutions(pokemon);
    return moveService.list(allMoves.map((move) => move.moveId));
  },

  getMovesOfAllEvolutions: async function (pokemon) {
    let moveLearn = await MoveLearning.find({
      pokemonId: pokemon.basePokemon.id,
      levelLearnAt: { $lt: pokemon.level },
      learnMethod: "LEVEL-UP",
    });

    const evolution = await evolutionService.isEvolution(
      pokemon.basePokemon.id
    );

    if (evolution !== null) {
      const moveLearn2 = await MoveLearning.find({
        pokemonId: evolution.pokemonId,
        levelLearnAt: { $lt: evolution.minLevel },
        learnMethod: "LEVEL-UP",
      });

      moveLearn = this.mergeAndOverwrite(moveLearn, moveLearn2);

      const previousEvolutionMoves = await this.getMovesOfAllEvolutions({
        basePokemon: { id: evolution.pokemonId },
        level: evolution.minLevel,
      });
      moveLearn = this.mergeAndOverwrite(moveLearn, previousEvolutionMoves);
    }

    return moveLearn;
  },

  mergeAndOverwrite: function (list1, list2) {
    const map = {};

    [...list1, ...list2].forEach((item) => {
      map[item.moveId] = item;
    });

    return Object.values(map);
  },
};

module.exports = MoveLearningService;
