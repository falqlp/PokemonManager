import { IPcStorage } from '../../domain/trainer/pcStorage/PcStorage';
import { IMapper } from 'shared/common/domain/IMapper';
import PokemonMapper from '../pokemon/PokemonMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
class PcStorageMapper implements IMapper<IPcStorage> {
  public constructor(protected pokemonMapper: PokemonMapper) {}

  public map(pcStorage: IPcStorage): IPcStorage {
    pcStorage.storage.map((s) => {
      s.pokemon = this.pokemonMapper.map(s.pokemon);
      return s;
    });
    return pcStorage;
  }
}

export default PcStorageMapper;
