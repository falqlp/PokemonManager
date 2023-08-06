const Evolution = require("./evolution");

const evolutionService = {
  hasEvolution: async function (id) {
    return Evolution.find({ pokemonId: id });
  },
  isEvolution: async function (id) {
    return Evolution.findOne({ evolveTo: id });
  },
};
module.exports = evolutionService;
