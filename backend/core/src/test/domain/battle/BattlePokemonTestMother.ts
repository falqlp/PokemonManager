import { IBattlePokemon } from '../../../application/battle/BattleInterfaces';
import { PokemonTestMother } from 'shared/models/test/domain/pokemon/PokemonTestMother';
import { StatsTestMother } from 'shared/models/test/domain/Stats/StatsTestMother';

export default class BattlePokemonTestMother {
  public static getBattlePokemon(trainerId?: string): IBattlePokemon {
    return {
      ...PokemonTestMother.generateBulbasaur(trainerId),
      dailyForm: 0,
      currentHp: StatsTestMother.getBulbasaurStatsLvl100().hp,
      cumulatedSpeed: 0,
      animation: '',
      moving: false,
      reload: 0,
    };
  }

  static withCustomOptions(options: Partial<IBattlePokemon>): IBattlePokemon {
    return {
      ...this.getBattlePokemon(options.trainerId),
      ...options,
    } as IBattlePokemon;
  }
}
