import Move, { IMove } from "./Move";
import ReadOnlyRepository from "../ReadOnlyRepository";
import MovePopulater from "./MovePopulater";

class MoveRepository extends ReadOnlyRepository<IMove> {
  private static instance: MoveRepository;
  public static getInstance(): MoveRepository {
    if (!MoveRepository.instance) {
      MoveRepository.instance = new MoveRepository(
        Move,
        MovePopulater.getInstance(),
      );
    }
    return MoveRepository.instance;
  }
}

export default MoveRepository;
