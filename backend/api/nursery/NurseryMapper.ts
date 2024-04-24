import { IMapper } from "../../domain/IMapper";
import { INursery } from "../../domain/nursery/Nursery";
import PokemonMapper from "../pokemon/PokemonMapper";
import { singleton } from "tsyringe";

@singleton()
class NurseryMapper implements IMapper<INursery> {
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
}

export default NurseryMapper;
