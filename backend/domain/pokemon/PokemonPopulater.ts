import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Move from "../move/Move";
import PokemonBase from "../pokemonBase/PokemonBase";

class PokemonPopulater extends Populater {
  private static instance: PokemonPopulater;

  public static getInstance(): PokemonPopulater {
    if (!PokemonPopulater.instance) {
      PokemonPopulater.instance = new PokemonPopulater();
    }
    return PokemonPopulater.instance;
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      { path: "moves", model: Move },
      { path: "basePokemon", model: PokemonBase },
    ];
  }
}

export default PokemonPopulater;
