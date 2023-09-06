import pokemonService from "../pokemon/pokemon.service";
import { IPcStorage, IPcStorageStorage } from "./pcStorage";

const PcStorageMapper = {
  map: async function (pcStorage: IPcStorage): Promise<IPcStorage> {
    pcStorage.storage = await Promise.all(
      pcStorage.storage.map(async (el: IPcStorageStorage) => {
        el.pokemon = await pokemonService.get(el.pokemon);
        return el;
      })
    );
    return pcStorage;
  },

  update: function (pcStorage: IPcStorage): IPcStorage {
    pcStorage.storage = pcStorage.storage.map((el: IPcStorageStorage) => {
      return { ...el, pokemon: el.pokemon._id };
    });
    return pcStorage;
  },
};

export default PcStorageMapper;
