import MoveLearningRepository from "../../domain/moveLearning/MoveLearningRepository";
import { IPokemon } from "../../domain/pokemon/Pokemon";
import { ListBody } from "../../domain/ReadOnlyRepository";
import MoveRepository from "../../domain/move/MoveRepository";
import { IMoveLearning } from "../../domain/moveLearning/MoveLearning";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";
import { IMove } from "../../domain/move/Move";
import WebsocketServerService from "../../websocket/WebsocketServerService";
import { singleton } from "tsyringe";

@singleton()
export default class MoveLearningService {
  constructor(
    protected moveLearningRepository: MoveLearningRepository,
    protected moveRepository: MoveRepository,
    protected evolutionRepository: EvolutionRepository,
    protected websocketServerService: WebsocketServerService,
  ) {}

  public newMoveLearned(pokemon: IPokemon): void {
    this.moveLearningRepository
      .getNewMoveLearned(pokemon)
      .then(async (movesLearns) => {
        if (movesLearns.length > 0) {
          let damagedMove = false;
          for (const moveLearn of movesLearns) {
            const move = await this.moveRepository.get(moveLearn.moveId);
            if (move.power > 0) {
              damagedMove = true;
            }
          }
          if (damagedMove) {
            this.websocketServerService.notifyNewMoveLearned(pokemon);
          }
        }
      });
  }

  public async learnableMoves(
    id: number,
    level: number,
    query?: ListBody,
  ): Promise<IMove[]> {
    const allMoves = await this.getMovesOfAllEvolutions(id, level);
    const allMovesString = allMoves.map((move) => {
      return move.moveId;
    });
    return (
      await this.moveRepository.list({ ...query, ids: allMovesString })
    ).filter((move) => move.power ?? 0 > 0);
  }

  public async getMovesOfAllEvolutions(
    id: number,
    level: number,
  ): Promise<IMoveLearning[]> {
    let moveLearn: IMoveLearning[] =
      await this.moveLearningRepository.getAllMoveAtLevel(id, level);

    const evolution = await this.evolutionRepository.isEvolution(id);

    if (evolution !== null && evolution.minLevel) {
      const moveLearn2: IMoveLearning[] =
        await this.moveLearningRepository.getAllMoveAtLevel(
          evolution.pokemonId,
          evolution.minLevel + 1,
        );

      moveLearn = this.mergeAndOverwrite(moveLearn, moveLearn2);

      const previousEvolutionMoves = await this.getMovesOfAllEvolutions(
        evolution.pokemonId,
        evolution.minLevel,
      );
      moveLearn = this.mergeAndOverwrite(moveLearn, previousEvolutionMoves);
    }

    return moveLearn;
  }

  public mergeAndOverwrite(
    list1: IMoveLearning[],
    list2: IMoveLearning[],
  ): IMoveLearning[] {
    const map: { [key: string]: IMoveLearning } = {};

    [...list1, ...list2].forEach((item) => {
      map[item.moveId] = item;
    });

    return Object.values(map) as IMoveLearning[];
  }
}
