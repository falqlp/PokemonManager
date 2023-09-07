import Evolution, { IEvolution } from "./evolution";

const evolutionService = {
  hasEvolution: async function (id: number): Promise<IEvolution[]> {
    return Evolution.find({ pokemonId: id });
  },
  isEvolution: async function (id: number): Promise<IEvolution | null> {
    return Evolution.findOne({ evolveTo: id });
  },
};
export default evolutionService;
