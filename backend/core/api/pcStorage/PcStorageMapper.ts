import { IPcStorage } from "../../domain/trainer/pcStorage/PcStorage";
import { IMapper } from "../../domain/IMapper";
import PokemonMapper from "../pokemon/PokemonMapper";
import { singleton } from "tsyringe";

@singleton()
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
