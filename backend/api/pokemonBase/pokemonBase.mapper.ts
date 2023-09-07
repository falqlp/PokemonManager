import { IPokemonBase } from "./pokemonBase";
import { IMapper } from "../IMapper";

const MoveMapper: IMapper<IPokemonBase> = {
  map: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
  update: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
};

export default MoveMapper;
