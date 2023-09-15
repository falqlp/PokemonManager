import PcStorage, { IPcStorage, IPcStorageStorage } from "./pcStorage";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/pokemon.service";

class PcStorageMapper implements IMapper<IPcStorage> {
  private static instance: PcStorageMapper;
  public constructor(protected pokemonService: PokemonService) {}
  public async map(pcStorage: IPcStorage): Promise<IPcStorage> {
    pcStorage.storage = await Promise.all(
      pcStorage.storage?.map(async (el: IPcStorageStorage) => {
        el.pokemon = await this.pokemonService.get(
          el.pokemon as unknown as string
        );
        return el;
      })
    );
    return pcStorage;
  }

  public async update(pcStorage: IPcStorage): Promise<IPcStorage> {
    pcStorage.storage = await Promise.all(
      pcStorage.storage?.map(async (pcStorage) => {
        pcStorage.pokemon = await this.pokemonService.update(
          pcStorage.pokemon._id,
          pcStorage.pokemon
        );
        return pcStorage;
      })
    );
    return pcStorage;
  }
  public static getInstance(): PcStorageMapper {
    if (!PcStorageMapper.instance) {
      PcStorageMapper.instance = new PcStorageMapper(
        PokemonService.getInstance()
      );
    }
    return PcStorageMapper.instance;
  }
}

export default PcStorageMapper;
