const Trainer = require("./trainer");
const pokemonService = require("../pokemon/pokemon.service");

const TrainerService = {
  get: async function (_id) {
    try {
      const trainer = await Trainer.findOne({ _id });
      trainer.pokemons = await pokemonService.list(trainer.pokemons);
      return trainer;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  list: async function (ids) {
    try {
      const trainers = await Trainer.find({ _id: { $in: ids } });
      return await Promise.all(
        trainers.map(async (trainer) => {
          trainer.pokemons = await pokemonService.list(trainer.pokemons);
          return trainer;
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  },

  update: async function (_id, trainer) {
    try {
      return await Trainer.updateOne(
        { _id },
        { ...trainer, pokemons: trainer.pokemons.map((pokemon) => pokemon._id) }
      );
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
module.exports = TrainerService;
