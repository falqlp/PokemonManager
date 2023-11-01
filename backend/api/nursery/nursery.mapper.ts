import { IMapper } from "../IMapper";
import { INursery } from "./nursery";
import PokemonService from "../pokemon/pokemon.service";

class NurseryMapper implements IMapper<INursery> {
  private static instance: NurseryMapper;
  constructor(protected pokemonService: PokemonService) {}
  public async map(dto: INursery): Promise<INursery> {
    if (dto.eggs) {
      if (dto.step !== "LAST_SELECTION") {
        dto.eggs = await this.pokemonService.list({
          ids: dto.eggs as unknown as string[],
        });
      } else {
        dto.eggs = await this.pokemonService.listNurseryLastSelection({
          ids: dto.eggs as unknown as string[],
        });
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
      NurseryMapper.instance = new NurseryMapper(PokemonService.getInstance());
    }
    return NurseryMapper.instance;
  }
}

export default NurseryMapper;
