import Populater from "../Populater";
import { PopulateOptions } from "mongoose";

class PokemonBasePopulater extends Populater {
  private static instance: PokemonBasePopulater;

  public static getInstance(): PokemonBasePopulater {
    if (!PokemonBasePopulater.instance) {
      PokemonBasePopulater.instance = new PokemonBasePopulater();
    }
    return PokemonBasePopulater.instance;
  }

  populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }
}

export default PokemonBasePopulater;
