import { IPokemon } from "../backend/api/pokemon/Pokemon";
import { IMove } from "../backend/api/move/Move";
import { IBattleTrainer } from "../backend/application/battle/BattleInterfaces";
const allTypes = [
  "BUG",
  "DARK",
  "DRAGON",
  "ELECTRIC",
  "FAIRY",
  "FIGHTING",
  "FIRE",
  "GHOST",
  "GRASS",
  "GROUND",
  "ICE",
  "NORMAL",
  "POISON",
  "PSY",
  "ROCK",
  "STEEL",
  "WATER",
];

function normalize(value: number, min: number, max: number): number {
  if (max === min) {
    return 0;
  }
  return (value - min) / (max - min);
}

function oneHotEncodeType(types: string[]): number[] {
  return allTypes.map((t) => (types.includes(t) ? 1 : 0));
}

function preparePokemonData(pokemon: IPokemon): number[] {
  let data = [];
  if (pokemon) {
    data.push(normalize(pokemon.basePokemon.baseStats.hp, 0, 255));
    data.push(normalize(pokemon.basePokemon.baseStats.atk, 0, 255));
    data.push(normalize(pokemon.basePokemon.baseStats.def, 0, 255));
    data.push(normalize(pokemon.basePokemon.baseStats.spe, 0, 255));
    data.push(normalize(pokemon.basePokemon.baseStats.spDef, 0, 255));
    data.push(normalize(pokemon.basePokemon.baseStats.spAtk, 0, 255));
    data.push(normalize(pokemon.level, 1, 100));
    data.push(
      normalize(pokemon.currentHp ?? pokemon.stats.hp, 0, pokemon.stats.hp)
    );
    data = data.concat(oneHotEncodeType(pokemon.basePokemon.types));
  } else {
    data.push(normalize(0, 0, 255));
    data.push(normalize(0, 0, 255));
    data.push(normalize(0, 0, 255));
    data.push(normalize(0, 0, 255));
    data.push(normalize(0, 0, 255));
    data.push(normalize(0, 0, 255));
    data.push(normalize(0, 0, 100));
    data.push(normalize(0, 0, 0));
    data = data.concat(oneHotEncodeType([""]));
  }
  return data;
}

function prepareMoveData(move: IMove): number[] {
  let data: number[] = [];
  data = data.concat(oneHotEncodeType([move.type]));
  data.push(normalize(move.power, 0, 250));
  data.push(normalize(move.accuracy, 0, 100));
  return data;
}

export function prepareEnvironmentState(
  player: IBattleTrainer,
  opponent: IBattleTrainer
): number[] {
  let state: number[] = [];
  for (let i = 0; i < 2; i++) {
    if (player.pokemons[0].moves[i]) {
      state = state.concat(prepareMoveData(player.pokemons[0].moves[i]));
    } else {
      state = state.concat(oneHotEncodeType([""]).concat([0, 0]));
    }
  }
  for (let i = 0; i < 6; i++) {
    state = state.concat(preparePokemonData(player.pokemons[i]));
  }
  for (let i = 0; i < 6; i++) {
    state = state.concat(preparePokemonData(opponent.pokemons[i]));
  }
  return state;
}
