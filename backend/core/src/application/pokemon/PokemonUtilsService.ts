import { getRandomFromArray, normalRandom } from 'shared/utils/RandomUtils';
import { Injectable } from '@nestjs/common';
import { POKEMON_NATURES } from '../../domain/pokemon/pokemonConst';
import {
  IPokemon,
  IPokemonStats,
  PokemonNature,
} from 'shared/models/pokemon/pokemon-models';

@Injectable()
class PokemonUtilsService {
  public generatePotential(nurseryLevel: number): number {
    let potential = 20 + Math.floor(normalRandom(nurseryLevel * 10, 6));
    if (potential > 100) {
      potential = 100;
    }
    if (potential < 0) {
      potential = 0;
    }
    return potential;
  }

  public generateIvs(): IPokemonStats {
    return {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      spe: Math.floor(Math.random() * 32),
    };
  }

  public initEvs(): IPokemonStats {
    return {
      hp: 0,
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      spe: 0,
    };
  }

  public generateHiddenPotential(potential: number): string {
    const pMin =
      potential - Math.floor(Math.random() * 3 * Math.sqrt(potential));
    const pMax =
      potential + Math.floor(Math.random() * 3 * Math.sqrt(potential));
    return `${pMin < 0 ? 0 : pMin} - ${pMax > 100 ? 100 : pMax}`;
  }

  public updateStats(pokemon: IPokemon): IPokemonStats {
    if (pokemon.level === 0) {
      return {
        hp: 0,
        atk: 0,
        def: 0,
        spe: 0,
        spAtk: 0,
        spDef: 0,
      };
    }
    return {
      hp: this.calcHp(
        pokemon.basePokemon.baseStats.hp,
        pokemon.level,
        pokemon.iv.hp,
        pokemon.ev.hp,
      ),
      atk: this.calcStat(
        pokemon.basePokemon.baseStats.atk,
        pokemon.level,
        pokemon.iv.atk,
        pokemon.ev.atk,
        POKEMON_NATURES[pokemon.nature].atk,
      ),
      def: this.calcStat(
        pokemon.basePokemon.baseStats.def,
        pokemon.level,
        pokemon.iv.def,
        pokemon.ev.def,
        POKEMON_NATURES[pokemon.nature].def,
      ),
      spAtk: this.calcStat(
        pokemon.basePokemon.baseStats.spAtk,
        pokemon.level,
        pokemon.iv.spAtk,
        pokemon.ev.spAtk,
        POKEMON_NATURES[pokemon.nature].spAtk,
      ),
      spDef: this.calcStat(
        pokemon.basePokemon.baseStats.spDef,
        pokemon.level,
        pokemon.iv.spDef,
        pokemon.ev.spDef,
        POKEMON_NATURES[pokemon.nature].spDef,
      ),
      spe: this.calcStat(
        pokemon.basePokemon.baseStats.spe,
        pokemon.level,
        pokemon.iv.spe,
        pokemon.ev.spe,
        POKEMON_NATURES[pokemon.nature].spe,
      ),
    } as IPokemonStats;
  }

  public calcStat(
    bs: number,
    niv: number,
    iv: number,
    ev: number,
    natureModifier: number,
  ): number {
    const base =
      Math.floor(
        ((2 * bs + (ev === 0 ? 0 : Math.floor(ev / 4)) + iv) * niv) / 100,
      ) + 5;
    const natureModification = Math.round((base * natureModifier) / 100);
    return base + natureModification;
  }

  public calcHp(bs: number, niv: number, iv: number, ev: number): number {
    return (
      Math.floor(
        ((2 * bs + (ev === 0 ? 0 : Math.floor(ev / 4)) + iv) * niv) / 100,
      ) +
      niv +
      10
    );
  }

  public generateShiny(): boolean {
    const nombreAleatoire = Math.floor(Math.random() * 4096);
    return nombreAleatoire === 0;
  }

  public getRandomNature(): PokemonNature {
    return getRandomFromArray(Object.values(PokemonNature));
  }
}

export default PokemonUtilsService;
