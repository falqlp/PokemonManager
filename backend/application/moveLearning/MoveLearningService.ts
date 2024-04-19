import { notifyNewMoveLearned } from "../../websocketServer";
import MoveLearningRepository from "../../domain/moveLearning/MoveLearningRepository";
import { IPokemon } from "../../api/pokemon/Pokemon";
import { ListBody } from "../../api/ReadOnlyService";
import MoveService from "../../api/move/MoveService";
import { IMoveLearning } from "../../domain/moveLearning/MoveLearning";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";

export default class MoveLearningService {
  private static instance: MoveLearningService;
  public static getInstance(): MoveLearningService {
    if (!MoveLearningService.instance) {
      MoveLearningService.instance = new MoveLearningService(
        MoveLearningRepository.getInstance(),
        MoveService.getInstance(),
        EvolutionRepository.getInstance()
      );
    }
    return MoveLearningService.instance;
  }
  constructor(
    protected moveLearningRepository: MoveLearningRepository,
    protected moveService: MoveService,
    protected evolutionRepository: EvolutionRepository
  ) {}

  public newMoveLearned(pokemon: IPokemon): void {
    this.moveLearningRepository
      .getNewMoveLearned(pokemon)
      .then((movesLearn) => {
        if (movesLearn.length > 0) {
          notifyNewMoveLearned(pokemon);
        }
      });
  }
  public async learnableMoves(id: number, level: number, query?: ListBody) {
    const allMoves = await this.getMovesOfAllEvolutions(id, level);
    const allMovesString = allMoves.map((move) => {
      return move.moveId;
    });
    return this.moveService.list({ ...query, ids: allMovesString });
  }

  public async getMovesOfAllEvolutions(
    id: number,
    level: number
  ): Promise<IMoveLearning[]> {
    let moveLearn: IMoveLearning[] =
      await this.moveLearningRepository.getAllMoveAtLevel(id, level);

    const evolution = await this.evolutionRepository.isEvolution(id);

    if (evolution !== null && evolution.minLevel) {
      const moveLearn2: IMoveLearning[] =
        await this.moveLearningRepository.getAllMoveAtLevel(
          evolution.pokemonId,
          evolution.minLevel + 1
        );

      moveLearn = this.mergeAndOverwrite(moveLearn, moveLearn2);

      const previousEvolutionMoves = await this.getMovesOfAllEvolutions(
        evolution.pokemonId,
        evolution.minLevel
      );
      moveLearn = this.mergeAndOverwrite(moveLearn, previousEvolutionMoves);
    }

    return moveLearn;
  }

  public mergeAndOverwrite(
    list1: IMoveLearning[],
    list2: IMoveLearning[]
  ): IMoveLearning[] {
    const map: { [key: string]: IMoveLearning } = {};

    [...list1, ...list2].forEach((item) => {
      map[item.moveId] = item;
    });

    return Object.values(map) as IMoveLearning[];
  }
}