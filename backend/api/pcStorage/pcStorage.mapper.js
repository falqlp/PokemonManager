const pokemonService = require("../pokemon/pokemon.service");

const TrainerMapper = {
  map: async function (pcStorage) {
    pcStorage.storage.map(async (el) => {
      el.pokemon = await pokemonService.get(el.pokemon);
    });
    return pcStorage;
  },

  update: function (pcStorage) {
    pcStorage.storage.map((el) => {
      el.pokemon = el.pokemon._id;
    });
    return pcStorage;
  },
};
module.exports = TrainerMapper;
