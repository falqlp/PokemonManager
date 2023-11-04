import { IMapper } from "../IMapper";
import { INursery } from "./nursery";
import { PopulateOptions } from "mongoose";
import Pokemon from "../pokemon/pokemon";
import PokemonMapper from "../pokemon/pokemon.mapper";

class NurseryMapper implements IMapper<INursery> {
  private static instance: NurseryMapper;
  constructor(protected pokemonMapper: PokemonMapper) {}

  public populate(): PopulateOptions {
    return {
      path: "eggs",
      model: Pokemon,
      populate: this.pokemonMapper.populate(),
    };
  }
  public map(dto: INursery): INursery {
    if (dto.eggs) {
      if (dto.step !== "LAST_SELECTION") {
        dto.eggs.map((egg) => this.pokemonMapper.map(egg));
      } else {
        dto.eggs.map((egg) => this.pokemonMapper.mapPartial(egg));
      }
    }
    return dto;
  }

  public update(dto: INursery): INursery {
    if (!dto.step) {
      dto.step = "WISHLIST";
    }
    if (!dto.level) {
      dto.level = 1;
    }
    return dto;
  }

  public static getInstance(): NurseryMapper {
    if (!NurseryMapper.instance) {
      NurseryMapper.instance = new NurseryMapper(PokemonMapper.getInstance());
    }
    return NurseryMapper.instance;
  }
}

export default NurseryMapper;
