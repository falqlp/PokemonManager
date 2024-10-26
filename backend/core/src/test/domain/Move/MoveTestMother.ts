import { IMove } from '../../../domain/move/Move';
import { PokemonType } from '../../../models/Types/Types';

export class MoveTestMother {
  static basicMove(): IMove {
    return {
      id: 1,
      name: 'Tackle',
      type: PokemonType.NORMAL,
      category: 'physical',
      accuracy: 100,
      power: 40,
      animation: {
        opponent: '',
        player: '',
      },
    } as IMove;
  }

  static withCustomOptions(options: Partial<IMove>): IMove {
    return {
      ...this.basicMove(),
      ...options,
    } as IMove;
  }

  static powerfulMove(): IMove {
    return this.withCustomOptions({
      id: 2,
      name: 'Hyper Beam',
      type: PokemonType.NORMAL,
      category: 'special',
      accuracy: 90,
      power: 150,
      animation: {
        opponent: '',
        player: '',
      },
    });
  }
}
