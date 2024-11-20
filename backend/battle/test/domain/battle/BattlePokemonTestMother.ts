import { PokemonTestMother } from 'shared/models/test/domain/pokemon/PokemonTestMother';
import { StatsTestMother } from 'shared/models/test/domain/Stats/StatsTestMother';
import { IBattlePokemon } from '../../../src/application/battle/BattleInterfaces';

export default class BattlePokemonTestMother {
  public static generateBulbasaur(trainerId?: string): IBattlePokemon {
    const pokemon = PokemonTestMother.generateBulbasaur(trainerId);
    return {
      basePokemon: pokemon.basePokemon,
      battleStrategy: pokemon.battleStrategy,
      level: pokemon.level,
      _id: pokemon._id,
      moves: pokemon.moves,
      trainerId: pokemon.trainerId,
      stats: pokemon.stats,
      strategy: pokemon.strategy,
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
      ...this.generateBulbasaur(options.trainerId),
      ...options,
    } as IBattlePokemon;
  }
}
