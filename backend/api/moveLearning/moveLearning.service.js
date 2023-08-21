const MoveLearning = require("./moveLearning");
const moveService = require("../move/move.service");
const evolutionService = require("../evolution/evolution.service");

const MoveLearningService = {
  learnableMoves: async function (id, level) {
    const allMoves = await this.getMovesOfAllEvolutions(id, level).map(
      (move) => move.moveId
    );
    return moveService.list({ ids: allMoves });
  },

  getMovesOfAllEvolutions: async function (id, level) {
    let moveLearn = await MoveLearning.find({
      pokemonId: id,
      levelLearnAt: { $lt: level + 1 },
      learnMethod: "LEVEL-UP",
    });

    const evolution = await evolutionService.isEvolution(id);

    if (evolution !== null) {
      const moveLearn2 = await MoveLearning.find({
        pokemonId: evolution.pokemonId,
        levelLearnAt: { $lt: evolution.minLevel + 1 },
        learnMethod: "LEVEL-UP",
      });

      moveLearn = this.mergeAndOverwrite(moveLearn, moveLearn2);

      const previousEvolutionMoves = await this.getMovesOfAllEvolutions(
        evolution.pokemonId,
        evolution.minLevel
      );
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
