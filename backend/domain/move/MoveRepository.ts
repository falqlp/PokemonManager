import Move, { IMove } from "./Move";
import ReadOnlyRepository from "../ReadOnlyRepository";
import MoveMapper from "./MoveMapper";

class MoveRepository extends ReadOnlyRepository<IMove> {
  private static instance: MoveRepository;
  public static getInstance(): MoveRepository {
    if (!MoveRepository.instance) {
      MoveRepository.instance = new MoveRepository(Move, MoveMapper);
    }
    return MoveRepository.instance;
  }
}

export default MoveRepository;
