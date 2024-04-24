import { IPcStorage } from "../../domain/pcStorage/PcStorage";
import { IMapper } from "../../domain/IMapper";
import PokemonMapper from "../pokemon/PokemonMapper";

class PcStorageMapper implements IMapper<IPcStorage> {
  private static instance: PcStorageMapper;
  public constructor(protected pokemonMapper: PokemonMapper) {}

  public map(pcStorage: IPcStorage): IPcStorage {
    pcStorage.storage.map((s) => {
      s.pokemon = this.pokemonMapper.map(s.pokemon);
      return s;
    });
    return pcStorage;
  }

  public static getInstance(): PcStorageMapper {
    if (!PcStorageMapper.instance) {
      PcStorageMapper.instance = new PcStorageMapper(
        PokemonMapper.getInstance(),
      );
    }
    return PcStorageMapper.instance;
  }
}

export default PcStorageMapper;
