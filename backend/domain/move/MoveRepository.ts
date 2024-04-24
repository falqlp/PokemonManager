import Move, { IMove } from "./Move";
import ReadOnlyRepository from "../ReadOnlyRepository";
import { singleton } from "tsyringe";
import MovePopulater from "./MovePopulater";

@singleton()
class MoveRepository extends ReadOnlyRepository<IMove> {
  constructor(movePopulater: MovePopulater) {
    super(Move, movePopulater);
  }
}

export default MoveRepository;
