import Move, { IMove } from "./move";
import moveMapper from "./move.mapper";
import ReadOnlyService from "../ReadOnlyService";
import Pokemon from "../pokemon/pokemon";
import PokemonMapper from "../pokemon/pokemon.mapper";
import MoveMapper from "./move.mapper";

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
