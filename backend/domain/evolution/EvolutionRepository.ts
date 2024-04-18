import Evolution, { IEvolution } from "./Evolution";
import PokemonBase, { IPokemonBase } from "../../api/pokemonBase/PokemonBase";

class EvolutionRepository {
  private static instance: EvolutionRepository;

  public static getInstance(): EvolutionRepository {
    if (!EvolutionRepository.instance) {
      EvolutionRepository.instance = new EvolutionRepository();
    }
    return EvolutionRepository.instance;
  }

  public hasEvolution(id: number): Promise<IEvolution[]> {
    return Evolution.find({ pokemonId: id });
  }
  public isEvolution(id: number): Promise<IEvolution | null> {
    return Evolution.findOne({ evolveTo: id });
  }
  public async evolve(
      id: number,
      level: number,
      method: string
  ): Promise<IPokemonBase> {
    const evolution = await Evolution.findOne({
      evolutionMethod: method,
      pokemonId: id,
      minLevel: {$lte: level},
    });
    return evolution ? PokemonBase.findOne({id: evolution.evolveTo}) : null; //TODO refactor
  }
}
export default EvolutionRepository;
