import { IPokemonBase } from '../../domain/pokemon/pokemonBase/PokemonBase';
import { IMapper } from 'shared/common/domain/IMapper';

const MoveMapper: IMapper<IPokemonBase> = {
  map: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
};

export default MoveMapper;
