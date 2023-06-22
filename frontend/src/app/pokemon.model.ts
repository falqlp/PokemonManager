export interface PokemonBaseModel {
  id: number;
  name: string;
  types: string[];
  baseStats: {
    hp: number;
    spe: number;
    atk: number;
    def: number;
    spAtk: number;
    spDef: number;
  };
}
