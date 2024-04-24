import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Move from "../move/Move";
import PokemonBase from "../pokemonBase/PokemonBase";
import { singleton } from "tsyringe";

@singleton()
class PokemonPopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      { path: "moves", model: Move },
      { path: "basePokemon", model: PokemonBase },
    ];
  }
}

export default PokemonPopulater;
