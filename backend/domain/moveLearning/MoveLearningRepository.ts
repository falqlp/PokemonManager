import MoveLearning, { IMoveLearning } from "./MoveLearning";
import { IPokemon } from "../../api/pokemon/Pokemon";

class MoveLearningRepository {
  private static instance: MoveLearningRepository;

  public async getNewMoveLearned(pokemon: IPokemon): Promise<IMoveLearning[]> {
    return MoveLearning.find({
      pokemonId: pokemon.basePokemon.id,
      levelLearnAt: pokemon.maxLevel,
      learnMethod: "LEVEL-UP",
    });
  }

  public getAllMoveAtLevel(
    id: number,
    level: number,
  ): Promise<IMoveLearning[]> {
    return MoveLearning.find({
      pokemonId: id,
      levelLearnAt: { $lte: level },
      learnMethod: "LEVEL-UP",
    });
  }

  public static getInstance(): MoveLearningRepository {
    if (!MoveLearningRepository.instance) {
      MoveLearningRepository.instance = new MoveLearningRepository();
    }
    return MoveLearningRepository.instance;
  }
}

export default MoveLearningRepository;
