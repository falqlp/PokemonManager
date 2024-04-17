import Move, { IMove } from "./Move";
import ReadOnlyService from "../ReadOnlyService";
import MoveMapper from "./MoveMapper";

class MoveService extends ReadOnlyService<IMove> {
  private static instance: MoveService;
  public static getInstance(): MoveService {
    if (!MoveService.instance) {
      MoveService.instance = new MoveService(Move, MoveMapper);
    }
    return MoveService.instance;
  }
}

export default MoveService;
