import { IPokemonBase } from "./pokemonBase";
import { IMapper } from "../IMapper";
import { PopulateOptions } from "mongoose";

const MoveMapper: IMapper<IPokemonBase> = {
  populate(): PopulateOptions | PopulateOptions[] {
    return null;
  },

  map: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
  update: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
};

export default MoveMapper;
