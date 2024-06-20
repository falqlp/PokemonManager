import { IBattlePokemon } from "../../../application/battle/BattleInterfaces";
import { PokemonTestMother } from "../pokemon/PokemonTestMother";
import { StatsTestMother } from "../Stats/StatsTestMother";

export default class BattlePokemonTestMother {
  public static getBattlePokemon(trainerId?: string): IBattlePokemon {
    return {
      ...PokemonTestMother.generateBulbasaur(trainerId),
      dailyForm: 0,
      currentHp: StatsTestMother.getBulbasaurStatsLvl100().hp,
      cumulatedSpeed: 0,
      animation: "",
      moving: false,
    };
  }

  static withCustomOptions(options: Partial<IBattlePokemon>): IBattlePokemon {
    return {
      ...this.getBattlePokemon(options.trainerId),
      ...options,
    } as IBattlePokemon;
  }
}
