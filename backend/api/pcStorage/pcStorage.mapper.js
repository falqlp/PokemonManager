const pokemonService = require("../pokemon/pokemon.service");

const PcStorageMapper = {
  map: async function (pcStorage) {
    pcStorage.storage = await Promise.all(
      pcStorage.storage.map(async (el) => {
        el.pokemon = await pokemonService.get(el.pokemon);
        return el;
      })
    );
    return pcStorage;
  },

  update: function (pcStorage) {
    pcStorage.storage = pcStorage.storage.map((el) => {
      return { ...el, pokemon: el.pokemon._id };
    });
    return pcStorage;
  },
};
module.exports = PcStorageMapper;
