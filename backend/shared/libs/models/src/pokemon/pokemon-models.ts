import { IMove } from '../move/mode-model';
import { Gender } from '../utils/utils-models';
import { MongoId } from 'shared/common';

export enum PokemonNature {
  HARDY = 'HARDY',
  LONELY = 'LONELY',
  BRAVE = 'BRAVE',
  ADAMANT = 'ADAMANT',
  NAUGHTY = 'NAUGHTY',
  BOLD = 'BOLD',
  DOCILE = 'DOCILE',
  RELAXED = 'RELAXED',
  IMPISH = 'IMPISH',
  LAX = 'LAX',
  TIMID = 'TIMID',
  HASTY = 'HASTY',
  SERIOUS = 'SERIOUS',
  JOLLY = 'JOLLY',
  NAIVE = 'NAIVE',
  MODEST = 'MODEST',
  MILD = 'MILD',
  QUIET = 'QUIET',
  BASHFUL = 'BASHFUL',
  RASH = 'RASH',
  CALM = 'CALM',
  GENTLE = 'GENTLE',
  SASSY = 'SASSY',
  CAREFUL = 'CAREFUL',
  QUIRKY = 'QUIRKY',
}
export enum PokemonType {
  NORMAL = 'NORMAL',
  FIRE = 'FIRE',
  WATER = 'WATER',
  ELECTRIC = 'ELECTRIC',
  GRASS = 'GRASS',
  ICE = 'ICE',
  FIGHTING = 'FIGHTING',
  POISON = 'POISON',
  GROUND = 'GROUND',
  FLYING = 'FLYING',
  PSY = 'PSY',
  BUG = 'BUG',
  ROCK = 'ROCK',
  GHOST = 'GHOST',
  DRAGON = 'DRAGON',
  DARK = 'DARK',
  STEEL = 'STEEL',
  FAIRY = 'FAIRY',
}

export interface IPokemonStats {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  spe: number;
}

export interface IPokemonBase extends MongoId {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: IPokemonStats;
  legendary?: boolean;
  mythical?: boolean;
  baby?: boolean;
  genderRate?: number;
  captureRate: number;
  baseHappiness: number;
  base: boolean;
  ultraBeast?: boolean;
  paradox?: boolean;
}

export interface IPokemon extends MongoId {
  trainerId?: string;
  nickname?: string;
  basePokemon: IPokemonBase;
  level: number;
  exp: number;
  moves: IMove[];
  stats: IPokemonStats;
  ev?: IPokemonStats;
  iv?: IPokemonStats;
  happiness: number;
  potential: number;
  trainingPercentage: number;
  birthday?: Date;
  gameId: string;
  maxLevel: number;
  hatchingDate?: Date;
  hiddenPotential: string;
  shiny: boolean;
  nature: PokemonNature;
  strategy: number[];
  battleStrategy?: number[];
  gender: Gender;
}
