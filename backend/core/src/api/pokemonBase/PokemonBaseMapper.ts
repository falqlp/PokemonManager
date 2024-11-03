import { IMapper } from 'shared/common/domain/IMapper';
import { IPokemonBase } from 'shared/models/pokemon/pokemon-models';

const MoveMapper: IMapper<IPokemonBase> = {
  map: function (pokemonBase: IPokemonBase): IPokemonBase {
    return pokemonBase;
  },
};

export default MoveMapper;
