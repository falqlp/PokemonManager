import { IPcStorage } from "./pcStorage";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/pokemon.service";
import { PopulateOptions } from "mongoose";
import PokemonMapper from "../pokemon/pokemon.mapper";
import Pokemon from "../pokemon/pokemon";

class PcStorageMapper implements IMapper<IPcStorage> {
  private static instance: PcStorageMapper;
  public constructor(
    protected pokemonService: PokemonService,
    protected pokemonMapper: PokemonMapper
  ) {}

  public populate(): PopulateOptions {
    return {
      path: "storage",
      populate: {
        path: "pokemon",
        model: Pokemon,
        populate: this.pokemonMapper.populate(),
      },
    };
  }
  public map(pcStorage: IPcStorage): IPcStorage {
    pcStorage.storage.map(async (s) => {
      s.pokemon = await this.pokemonMapper.map(s.pokemon);
      return s;
    });
    return pcStorage;
  }

  public async update(pcStorage: IPcStorage): Promise<IPcStorage> {
    if (!pcStorage.storage) {
      pcStorage.storage = [];
    }
    if (!pcStorage.maxSize) {
      pcStorage.maxSize = 0;
    }
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
        PokemonService.getInstance(),
        PokemonMapper.getInstance()
      );
    }
    return PcStorageMapper.instance;
  }
}

export default PcStorageMapper;
