import Populater from "../../Populater";
import { PopulateOptions } from "mongoose";
import Pokemon from "../../pokemon/Pokemon";
import PokemonPopulater from "../../pokemon/PokemonPopulater";
import { singleton } from "tsyringe";

@singleton()
class PcStoragePopulater extends Populater {
  constructor(protected pokemonPopulater: PokemonPopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "storage",
      populate: {
        path: "pokemon",
        model: Pokemon,
        populate: this.pokemonPopulater.populate(),
      },
    };
  }
}

export default PcStoragePopulater;
