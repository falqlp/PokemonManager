import MoveLearning, { IMoveLearning } from "./moveLearning";
import MoveService from "../move/move.service";
import evolutionService from "../evolution/evolution.service";
import { IPokemon } from "../pokemon/pokemon";
import { notifyNewMoveLearned } from "../../websocketServer";
import { ListBody } from "../ReadOnlyService";

class MoveLearningService {
  private static instance: MoveLearningService;
  constructor(protected moveService: MoveService) {}

  async newMoveLearned(pokemon: IPokemon): Promise<void> {
    MoveLearning.find({
      pokemonId: pokemon.basePokemon.id,
      levelLearnAt: pokemon.maxLevel,
      learnMethod: "LEVEL-UP",
    }).then((movesLearn) => {
      if (movesLearn.length > 0) {
        notifyNewMoveLearned(pokemon);
      }
    });
  }
  async learnableMoves(id: number, level: number, query?: ListBody) {
    const allMoves = await this.getMovesOfAllEvolutions(id, level);
    const allMovesString = allMoves.map((move) => {
      return move.moveId;
    });
    return this.moveService.list({ ...query, ids: allMovesString });
  }

  async getMovesOfAllEvolutions(
    id: number,
    level: number
  ): Promise<IMoveLearning[]> {
    let moveLearn: IMoveLearning[] = await MoveLearning.find({
      pokemonId: id,
      levelLearnAt: { $lte: level },
      learnMethod: "LEVEL-UP",
    });

    const evolution = await evolutionService.isEvolution(id);

    if (evolution !== null && evolution.minLevel) {
      const moveLearn2: IMoveLearning[] = await MoveLearning.find({
        pokemonId: evolution.pokemonId,
        levelLearnAt: { $lt: evolution.minLevel + 1 },
        learnMethod: "LEVEL-UP",
      });

      moveLearn = this.mergeAndOverwrite(moveLearn, moveLearn2);

      const previousEvolutionMoves = await this.getMovesOfAllEvolutions(
        evolution.pokemonId,
        evolution.minLevel
      );
      moveLearn = this.mergeAndOverwrite(moveLearn, previousEvolutionMoves);
    }

    return moveLearn;
  }

  mergeAndOverwrite(
    list1: IMoveLearning[],
    list2: IMoveLearning[]
  ): IMoveLearning[] {
    const map: { [key: string]: IMoveLearning } = {};

    [...list1, ...list2].forEach((item) => {
      map[item.moveId] = item;
    });

    return Object.values(map) as IMoveLearning[];
  }

  public static getInstance(): MoveLearningService {
    if (!MoveLearningService.instance) {
      MoveLearningService.instance = new MoveLearningService(
        MoveService.getInstance()
      );
    }
    return MoveLearningService.instance;
  }
}

export default MoveLearningService;
