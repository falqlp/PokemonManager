import Move, { IMove } from "./Move";
import moveMapper from "./MoveMapper";
import ReadOnlyService from "../ReadOnlyService";
import Pokemon from "../pokemon/Pokemon";
import PokemonMapper from "../pokemon/PokemonMapper";
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
