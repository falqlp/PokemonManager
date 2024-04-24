import { IPokemonBase } from "../../domain/pokemonBase/PokemonBase";
import { IMapper } from "../../domain/IMapper";

const MoveMapper: IMapper<IPokemonBase> = {
  map: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
};

export default MoveMapper;
