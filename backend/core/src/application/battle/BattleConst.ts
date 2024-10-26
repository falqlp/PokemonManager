import { PokemonType } from '../../models/Types/Types';
import { IMove } from '../../domain/move/Move';

export const DefaultMove: IMove = {
  _id: '64b0026d3ca816e9336d9274',
  name: 'STRUGGLE',
  accuracy: 100,
  category: 'physical',
  id: 165,
  power: 30,
  type: PokemonType.NORMAL,
  animation: {
    opponent: 'NORMAL',
  },
};
