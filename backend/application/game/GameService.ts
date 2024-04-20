import { IGame } from "../../domain/game/Game";
import User from "../../api/user/User";
import GameRepository from "../../domain/game/GameRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";

class GameService {
  private static instance: GameService;

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService(
        GameRepository.getInstance(),
        TrainerRepository.getInstance()
      );
    }
    return GameService.instance;
  }
  constructor(
    protected gameRepository: GameRepository,
    protected trainerRepository: TrainerRepository
  ) {}

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
    let newGame = await this.gameRepository.create(dto, gameId);
    newGame.player = await this.trainerRepository.create(player, newGame._id);
    newGame = await this.gameRepository.update(newGame._id, newGame);
    User.findByIdAndUpdate(userId, { $push: { games: newGame._id } }).then();
    return newGame;
  }
}

export default GameService;
