import MoveLearning, { IMoveLearning } from "./MoveLearning";
import { IPokemon } from "../pokemon/Pokemon";
import { singleton } from "tsyringe";

@singleton()
class MoveLearningRepository {
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
}

export default MoveLearningRepository;
