import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Pokemon from "../pokemon/Pokemon";
import PokemonPopulater from "../pokemon/PokemonPopulater";

class NurseryPopulater extends Populater {
  private static instance: NurseryPopulater;

  public static getInstance(): NurseryPopulater {
    if (!NurseryPopulater.instance) {
      NurseryPopulater.instance = new NurseryPopulater(
        PokemonPopulater.getInstance(),
      );
    }
    return NurseryPopulater.instance;
  }

  constructor(protected pokemonPopulater: PokemonPopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "eggs",
      model: Pokemon,
      populate: this.pokemonPopulater.populate(),
    };
  }
}

export default NurseryPopulater;
