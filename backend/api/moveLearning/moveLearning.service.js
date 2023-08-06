const MoveLearning = require("./moveLearning");
const moveService = require("../move/move.service");

const MoveLearningService = {
  learnableMoves: async function (pokemon) {
    const moveLearn = await MoveLearning.find({
      pokemonId: pokemon.basePokemon.id,
      levelLearnAt: { $lt: pokemon.level },
      learnMethod: "LEVEL-UP",
    });
    return moveService.list(moveLearn.map((move) => move.moveId));
  },
};

module.exports = MoveLearningService;
