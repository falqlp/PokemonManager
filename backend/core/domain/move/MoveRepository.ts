import Move, { IMove } from "./Move";
import ReadOnlyRepository from "../ReadOnlyRepository";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../EmptyPopulater";

@singleton()
class MoveRepository extends ReadOnlyRepository<IMove> {
  constructor(movePopulater: EmptyPopulater) {
    super(Move, movePopulater);
  }
}

export default MoveRepository;
