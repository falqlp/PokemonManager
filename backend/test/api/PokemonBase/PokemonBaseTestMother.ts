import { IPokemonBase } from "../../../api/pokemonBase/PokemonBase";
import { PokemonType } from "../../../models/Types/Types";
import { IPokemonStats } from "../../../models/PokemonModels/pokemonStats";
import { StatsTestMother } from "../Stats/StatsTestMother";

export class PokemonBaseTestMother {
  static generateBulbasaurBase(): IPokemonBase {
    return {
      id: 1,
      name: "Bulbasaur",
      types: [PokemonType.GRASS, PokemonType.POISON],
      baseStats: StatsTestMother.getBulbasaurBaseStats(),
      legendary: false,
      mythical: false,
      baby: false,
      genderRate: 1,
      captureRate: 45,
      baseHappiness: 70,
      base: true,
    } as IPokemonBase;
  }

  static withCustomOptions(options: Partial<IPokemonBase>): IPokemonBase {
    return {
      ...this.generateBulbasaurBase(),
      ...options,
    } as IPokemonBase;
  }

  static generateArticunoBase(): IPokemonBase {
    return this.withCustomOptions({
      id: 144,
      name: "Articuno",
      types: [PokemonType.ICE, PokemonType.FLYING],
      baseStats: StatsTestMother.getArticunoBaseStats(),
      legendary: true,
      mythical: false,
      baby: false,
      genderRate: -1,
      captureRate: 3,
      baseHappiness: 35,
      base: true,
    });
  }
}
