import { IPokemon } from "../../../api/pokemon/Pokemon";
import { PokemonBaseTestMother } from "../PokemonBase/PokemonBase.test";
import { StatsTestMother } from "../Stats/Stats.test";
import { MoveTestMother } from "../Move/Move.test";

export class PokemonTestMother {
  static generateBulbasaur(): IPokemon {
    return {
      age: 1,
      exp: 0,
      basePokemon: PokemonBaseTestMother.generateBulbasaurBase(),
      level: 100,
      potential: 100,
      birthday: new Date(Date.now()),
      ev: StatsTestMother.getEvs(),
      iv: StatsTestMother.getIVs(),
      stats: StatsTestMother.getBulbasaurStatsLvl100(),
      moves: [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()],
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
      age: 1,
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
