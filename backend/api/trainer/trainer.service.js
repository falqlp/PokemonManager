const Trainer = require("./trainer");
const trainerMapper = require("./trainer.mapper");
const CompleteService = require("../CompleteService");

const TrainerService = {
  ...new CompleteService(Trainer, trainerMapper),

  addPokemon: async function (pokemon) {
    const trainer = await this.get(pokemon.trainerId);
    return this.update(trainer._id, {
      ...trainer,
      pokemons: trainer.pokemons.push(pokemon._id),
    });
  },
};
module.exports = TrainerService;
