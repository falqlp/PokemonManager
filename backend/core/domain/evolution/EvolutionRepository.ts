import Evolution, { IEvolution } from "./Evolution";
import { IPokemonBase } from "../pokemon/pokemonBase/PokemonBase";
import PokemonBaseRepository from "../pokemon/pokemonBase/PokemonBaseRepository";
import { singleton } from "tsyringe";

@singleton()
class EvolutionRepository {
  constructor(protected pokemonBaseRepository: PokemonBaseRepository) {}

  public hasEvolution(id: number): Promise<IEvolution[]> {
    return Evolution.find({ pokemonId: id });
  }

  public isEvolution(id: number): Promise<IEvolution | null> {
    return Evolution.findOne({ evolveTo: id });
  }

  public async evolve(
    id: number,
    level: number,
    method: string,
  ): Promise<IPokemonBase> {
    const evolution = await Evolution.findOne({
      evolutionMethod: method,
      pokemonId: id,
      minLevel: { $lte: level },
    });
    return evolution
      ? this.pokemonBaseRepository.getPokemonBaseById(evolution.evolveTo)
      : null;
  }

  public async maxEvolution(
    id: number,
    level: number,
    method: string,
  ): Promise<IPokemonBase> {
    let evolution = await Evolution.findOne({
      evolutionMethod: method,
      pokemonId: id,
      minLevel: { $lte: level },
    });
    if (evolution) {
      const maxEvolution = await Evolution.findOne({
        evolutionMethod: method,
        pokemonId: evolution.evolveTo,
        minLevel: { $lte: level },
      });
      if (maxEvolution) {
        evolution = maxEvolution;
      }
    }
    return evolution
      ? this.pokemonBaseRepository.getPokemonBaseById(evolution.evolveTo)
      : null;
  }
}
export default EvolutionRepository;
