import type { PokemonBaseModel } from './pokemonBase.model';
import type { PokemonStatsModel } from './pokemonStats.model';
import { MoveModel } from '../move.model';
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

export interface PokemonModel {
  _id?: string;
  trainerId: string;
  nickname?: string;
  basePokemon: PokemonBaseModel;
  level: number;
  exp: number;
  moves?: MoveModel[];
  stats: PokemonStatsModel;
  ev?: PokemonStatsModel;
  iv?: PokemonStatsModel;
  shiny: boolean;
  currentHp?: number;
  maxLevel: number;
  hiddenPotential: string;
  hatchingDate?: Date;
  age: number;
  birthday: Date;
  nature: PokemonNature;
  strategy: number[];
}

export const POKEMON_NATURES: Record<PokemonNature, PokemonStatsModel> = {
  HARDY: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
  LONELY: { hp: 0, atk: 10, def: -10, spAtk: 0, spDef: 0, spe: 0 },
  BRAVE: { hp: 0, atk: 10, def: 0, spAtk: 0, spDef: 0, spe: -10 },
  ADAMANT: { hp: 0, atk: 10, def: 0, spAtk: -10, spDef: 0, spe: 0 },
  NAUGHTY: { hp: 0, atk: 10, def: 0, spAtk: 0, spDef: -10, spe: 0 },
  BOLD: { hp: 0, atk: -10, def: 10, spAtk: 0, spDef: 0, spe: 0 },
  DOCILE: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
  RELAXED: { hp: 0, atk: 0, def: 10, spAtk: 0, spDef: 0, spe: -10 },
  IMPISH: { hp: 0, atk: 0, def: 10, spAtk: -10, spDef: 0, spe: 0 },
  LAX: { hp: 0, atk: 0, def: 10, spAtk: 0, spDef: -10, spe: 0 },
  TIMID: { hp: 0, atk: -10, def: 0, spAtk: 0, spDef: 0, spe: 10 },
  HASTY: { hp: 0, atk: 0, def: -10, spAtk: 0, spDef: 0, spe: 10 },
  SERIOUS: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
  JOLLY: { hp: 0, atk: 0, def: 0, spAtk: -10, spDef: 0, spe: 10 },
  NAIVE: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: -10, spe: 10 },
  MODEST: { hp: 0, atk: -10, def: 0, spAtk: 10, spDef: 0, spe: 0 },
  MILD: { hp: 0, atk: 0, def: -10, spAtk: 10, spDef: 0, spe: 0 },
  QUIET: { hp: 0, atk: 0, def: 0, spAtk: 10, spDef: 0, spe: -10 },
  BASHFUL: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
  RASH: { hp: 0, atk: 0, def: 0, spAtk: 10, spDef: -10, spe: 0 },
  CALM: { hp: 0, atk: -10, def: 0, spAtk: 0, spDef: 10, spe: 0 },
  GENTLE: { hp: 0, atk: 0, def: -10, spAtk: 0, spDef: 10, spe: 0 },
  SASSY: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 10, spe: -10 },
  CAREFUL: { hp: 0, atk: 0, def: 0, spAtk: -10, spDef: 10, spe: 0 },
  QUIRKY: { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, spe: 0 },
};
