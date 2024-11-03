import { PokemonType } from '../pokemon/pokemon-models';
import { MongoId } from 'shared/common';

export interface IAnimation {
  opponent?: string;
  player?: string;
}
export enum SideEffect {
  DRAIN = 'Drain',
  RELOAD = 'Reload',
}

export type ISideEffect = Record<SideEffect, number>;

export interface IMove extends MongoId {
  id: number;
  name: string;
  type: PokemonType;
  category: string;
  accuracy: number;
  power?: number;
  animation: IAnimation;
  sideEffect?: ISideEffect;
}
