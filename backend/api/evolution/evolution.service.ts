import Evolution, { IEvolution } from "./evolution";
import PokemonBase, { IPokemonBase } from "../pokemonBase/pokemonBase";

const evolutionService = {
  hasEvolution: async function (id: number): Promise<IEvolution[]> {
    return Evolution.find({ pokemonId: id });
  },
  isEvolution: async function (id: number): Promise<IEvolution | null> {
    return Evolution.findOne({ evolveTo: id });
  },
  evolve: async function (
    id: number,
    level: number,
    method: string
  ): Promise<IPokemonBase> {
    const evolution = await Evolution.findOne({
      evolutionMethod: method,
      pokemonId: id,
      minLevel: level,
    });
    return evolution ? PokemonBase.findOne({ id: evolution.evolveTo }) : null;
  },
};
export default evolutionService;
