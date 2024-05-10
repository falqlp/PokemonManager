import { IPokemon, PokemonNature } from "../../../domain/pokemon/Pokemon";
import { PokemonBaseTestMother } from "../PokemonBase/PokemonBaseTestMother";
import { StatsTestMother } from "../Stats/StatsTestMother";
import { MoveTestMother } from "../Move/MoveTestMother";

export class PokemonTestMother {
  static generateBulbasaur(): IPokemon {
    return {
      exp: 0,
      basePokemon: PokemonBaseTestMother.generateBulbasaurBase(),
      level: 100,
      potential: 100,
      birthday: new Date(Date.now()),
      ev: StatsTestMother.getEvs(),
      iv: StatsTestMother.getIVs(),
      stats: StatsTestMother.getBulbasaurStatsLvl100(),
      trainingPercentage: 100,
      moves: [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()],
      shiny: false,
      nature: PokemonNature.HARDY,
    } as IPokemon;
  }

  static withCustomOptions(options: Partial<IPokemon>): IPokemon {
    return {
      ...this.generateBulbasaur(),
      ...options,
    } as IPokemon;
  }

  static generateArticuno(): IPokemon {
    return this.withCustomOptions({
      exp: 0,
      basePokemon: PokemonBaseTestMother.generateArticunoBase(),
      level: 100,
      potential: 100,
      birthday: new Date(Date.now()),
      ev: StatsTestMother.getEvs(),
      iv: StatsTestMother.getIVs(),
      stats: StatsTestMother.getArticunoStatsLvl100(),
      moves: [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()],
    } as IPokemon);
  }
}
