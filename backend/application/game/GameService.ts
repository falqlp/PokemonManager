import { IGame } from "../../domain/game/Game";
import User from "../../domain/user/User";
import GameRepository from "../../domain/game/GameRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import GenerateCalendarService from "../calendarEvent/GenerateCalendarService";
import { PeriodModel } from "../PeriodModel";
import WebsocketServerService from "../../WebsocketServerService";
import { singleton } from "tsyringe";

export const NB_GENERATED_TRAINER = 19;

@singleton()
class GameService {
  constructor(
    protected gameRepository: GameRepository,
    protected trainerRepository: TrainerRepository,
    protected trainerService: TrainerService,
    protected generateCalendarService: GenerateCalendarService,
    protected websocketServerService: WebsocketServerService,
  ) {}

  public async createWithUser(dto: IGame, userId: string): Promise<IGame> {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getUTCFullYear();
    dto.actualDate = new Date(Date.UTC(currentYear, 0, 1));
    const player = dto.player;
    dto.player = undefined;
    let newGame = await this.gameRepository.create(dto);
    player.gameId = newGame._id;
    newGame.player = await this.trainerService.create(player);
    newGame = await this.gameRepository.update(newGame._id, newGame);
    User.findByIdAndUpdate(userId, { $push: { games: newGame._id } }).then(); //TODO a refactor
    return newGame;
  }

  public async initGame(gameId: string): Promise<void> {
    const game = await this.gameRepository.get(gameId);
    for (let i = 0; i < NB_GENERATED_TRAINER; i++) {
      this.websocketServerService.sendMessageToClientInGame(gameId, {
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
        { max: 8, min: 3 },
      );
    }

    const trainers = await this.trainerRepository.list({}, { gameId });
    const startDate = new Date(game.actualDate);
    const endDate = new Date(game.actualDate);
    startDate.setUTCDate(startDate.getUTCDate() + 1);
    endDate.setUTCMonth(endDate.getUTCMonth() + 6);
    const championshipPeriod: PeriodModel = {
      startDate,
      endDate,
    };
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGame",
      payload: {
        key: "CALENDAR_GENERATION",
      },
    });
    await this.generateCalendarService.generateChampionship(
      trainers,
      3,
      gameId,
      championshipPeriod,
    );
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGameEnd",
    });
  }
}

export default GameService;
