const pokemonService = require("../pokemon/pokemon.service");

const TrainerMapper = {
  map: async function (trainer) {
    trainer.pokemons = await pokemonService.list(trainer.pokemons);
    return trainer;
  },

  update: function (trainer) {
    trainer.pokemons = trainer.pokemons.map((pokemon) => pokemon._id);
    return trainer;
  },
};
module.exports = TrainerMapper;
