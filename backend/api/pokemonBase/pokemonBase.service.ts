import PokemonBase, { IPokemonBase } from "./pokemonBase";
import ReadOnlyService from "../ReadOnlyService";
import PokemonBaseMapper from "./pokemonBase.mapper";

class PokemonBaseService extends ReadOnlyService<IPokemonBase> {
  private static instance: PokemonBaseService;
  public static getInstance(): PokemonBaseService {
    if (!PokemonBaseService.instance) {
      PokemonBaseService.instance = new PokemonBaseService(
        PokemonBase,
        PokemonBaseMapper
      );
    }
    return PokemonBaseService.instance;
  }
}

export default PokemonBaseService;
