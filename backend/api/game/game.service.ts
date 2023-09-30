import CompleteService from "../CompleteService";
import Game, { IGame } from "./game";
import GameMapper from "./game.mapper";

class GameService extends CompleteService<IGame> {
  private static instance: GameService;
  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService(Game, GameMapper.getInstance());
    }
    return GameService.instance;
  }
}

export default GameService;
