import CompleteService from "../CompleteService";
import Game, { IGame } from "./game";
import GameMapper from "./game.mapper";
import { Model } from "mongoose";
import TrainerService from "../trainer/trainer.service";
import User from "../user/user";

class GameService extends CompleteService<IGame> {
  private static instance: GameService;

  constructor(
    schema: Model<IGame>,
    mapper: GameMapper,
    protected trainerService: TrainerService
  ) {
    super(schema, mapper);
  }
  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService(
        Game,
        GameMapper.getInstance(),
        TrainerService.getInstance()
      );
    }
    return GameService.instance;
  }

  public async createWithUser(
    dto: IGame,
    gameId: string,
    userId: string
  ): Promise<IGame> {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getUTCFullYear();
    dto.actualDate = new Date(Date.UTC(currentYear, 0, 1));
    const player = dto.player;
    dto.player = undefined;
    let newGame = await super.create(dto, gameId);
    newGame.player = await this.trainerService.create(player, newGame._id);
    newGame = await super.update(newGame._id, newGame);
    User.findOneAndUpdate(
      { _id: userId },
      { $push: { games: newGame._id } }
    ).then();
    return newGame;
  }
}

export default GameService;
