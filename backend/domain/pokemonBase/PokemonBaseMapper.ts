import { IPokemonBase } from "./PokemonBase";
import { IMapper } from "../../api/IMapper";
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
