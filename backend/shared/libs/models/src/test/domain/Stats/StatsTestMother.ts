import { IPokemonStats } from 'shared/models/pokemon/pokemon-models';

export class StatsTestMother {
  static getEvs(): IPokemonStats {
    return this.getAll0();
  }

  static getAll0(): IPokemonStats {
    return {
      hp: 0,
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      spe: 0,
    } as IPokemonStats;
  }

  static getIVs(): IPokemonStats {
    return {
      hp: 31,
      atk: 31,
      def: 31,
      spAtk: 31,
      spDef: 31,
      spe: 31,
    } as IPokemonStats;
  }

  static getBulbasaurBaseStats(): IPokemonStats {
    return {
      hp: 45,
      atk: 49,
      def: 49,
      spAtk: 65,
      spDef: 65,
      spe: 45,
    } as IPokemonStats;
  }

  static getArticunoBaseStats(): IPokemonStats {
    return {
      hp: 90,
      atk: 85,
      def: 100,
      spAtk: 95,
      spDef: 125,
      spe: 85,
    } as IPokemonStats;
  }

  static getBulbasaurStatsLvl100(): IPokemonStats {
    return {
      hp: 231,
      atk: 134,
      def: 134,
      spAtk: 166,
      spDef: 166,
      spe: 126,
    } as IPokemonStats;
  }

  static getArticunoStatsLvl100(): IPokemonStats {
    return {
      hp: 321,
      atk: 206,
      def: 236,
      spAtk: 226,
      spDef: 286,
      spe: 206,
    } as IPokemonStats;
  }

  static basicStats(): IPokemonStats {
    return {
      hp: 50,
      atk: 50,
      def: 50,
      spAtk: 50,
      spDef: 50,
      spe: 50,
    };
  }
}
