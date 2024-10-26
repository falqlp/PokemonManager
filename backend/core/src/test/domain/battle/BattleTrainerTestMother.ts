import { IBattleTrainer } from '../../../application/battle/BattleInterfaces';
import BattlePokemonTestMother from './BattlePokemonTestMother';

export default class BattleTrainerTestMother {
  public static getBattleTrainer(trainerId?: string): IBattleTrainer {
    return {
      _id: trainerId ?? 'BattleTrainerId',
      defeat: false,
      class: '',
      pokemons: [
        BattlePokemonTestMother.getBattlePokemon(
          trainerId ?? 'BattleTrainerId',
        ),
      ],
      isAI: false,
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
