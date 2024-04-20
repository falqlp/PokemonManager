import { IGame } from "../../domain/game/Game";
import User from "../../api/user/User";
import GameRepository from "../../domain/game/GameRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import { sendMessageToClientInGame } from "../../websocketServer";

export const NB_GENERATED_TRAINER = 19;

class GameService {
  private static instance: GameService;

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService(
        GameRepository.getInstance(),
        TrainerRepository.getInstance(),
        TrainerService.getInstance()
      );
    }
    return GameService.instance;
  }
  constructor(
    protected gameRepository: GameRepository,
    protected trainerRepository: TrainerRepository,
    protected trainerService: TrainerService
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
    User.findByIdAndUpdate(userId, { $push: { games: newGame._id } }).then(); //TODO a refactor
    return newGame;
  }

  public async initGame(gameId: string): Promise<void> {
    for (let i = 0; i < NB_GENERATED_TRAINER; i++) {
      sendMessageToClientInGame(gameId, {
        type: "initGame",
        payload: {
          key: "TRAINER_GENERATION",
          value: `${i}/${NB_GENERATED_TRAINER}`,
        },
      });
      const trainer = await this.trainerService.generateTrainer(gameId);
      await this.trainerService.generateTrainerPokemons(
        gameId,
        trainer,
        { max: 3, min: 1 },
        { max: 8, min: 3 }
      );
    }
    sendMessageToClientInGame(gameId, {
      type: "initGameEnd",
    });
  }
}

export default GameService;
