import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
class PokemonBasePopulater extends Populater {
  populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }
}

export default PokemonBasePopulater;
