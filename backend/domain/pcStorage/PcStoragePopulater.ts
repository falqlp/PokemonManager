import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Pokemon from "../pokemon/Pokemon";
import PokemonPopulater from "../pokemon/PokemonPopulater";

class PcStoragePopulater extends Populater {
  private static instance: PcStoragePopulater;

  public static getInstance(): PcStoragePopulater {
    if (!PcStoragePopulater.instance) {
      PcStoragePopulater.instance = new PcStoragePopulater(
        PokemonPopulater.getInstance(),
      );
    }
    return PcStoragePopulater.instance;
  }

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
