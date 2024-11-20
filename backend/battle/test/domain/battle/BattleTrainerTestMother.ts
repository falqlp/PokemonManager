import BattlePokemonTestMother from './BattlePokemonTestMother';
import { IBattleTrainer } from '../../../src/application/battle/BattleInterfaces';

export default class BattleTrainerTestMother {
  public static getBattleTrainer(trainerId?: string): IBattleTrainer {
    return {
      _id: trainerId ?? 'BattleTrainerId',
      defeat: false,
      class: '',
      pokemons: [
        BattlePokemonTestMother.generateBulbasaur(
          trainerId ?? 'BattleTrainerId',
        ),
      ],
      name: 'BattleTrainer',
    };
  }

  public static withCustomOptions(
    options: Partial<IBattleTrainer>,
  ): IBattleTrainer {
    return {
      ...this.getBattleTrainer(),
      ...options,
    } as IBattleTrainer;
  }
}
