import { IMapper } from "../../domain/IMapper";
import { INursery } from "../../domain/nursery/Nursery";
import PokemonMapper from "../pokemon/PokemonMapper";

class NurseryMapper implements IMapper<INursery> {
  private static instance: NurseryMapper;
  constructor(protected pokemonMapper: PokemonMapper) {}

  public map(dto: INursery): INursery {
    if (dto.eggs) {
      if (dto.step !== "LAST_SELECTION") {
        dto.eggs.map((egg) => this.pokemonMapper.mapNurseryFirstSelection(egg));
      } else {
        dto.eggs.map((egg) =>
          this.pokemonMapper.mapNurserySecondSelection(egg),
        );
      }
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
