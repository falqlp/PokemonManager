import { IGame } from "../../domain/game/Game";
import User from "../../domain/user/User";
import GameRepository from "../../domain/game/GameRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import GenerateCalendarService from "../calendarEvent/GenerateCalendarService";
import WebsocketServerService from "../../WebsocketServerService";
import { singleton } from "tsyringe";
import CompetitionService from "../competition/CompetitionService";

export const NB_GENERATED_TRAINER = 19;

@singleton()
class GameService {
  constructor(
    protected gameRepository: GameRepository,
    protected trainerRepository: TrainerRepository,
    protected trainerService: TrainerService,
    protected generateCalendarService: GenerateCalendarService,
    protected websocketServerService: WebsocketServerService,
    protected competitionService: CompetitionService,
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

  public async initGame(gameId: string, playerId: string): Promise<void> {
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGame",
      payload: {
        key: "TRAINER_GENERATION",
      },
    });
    const game = await this.gameRepository.get(gameId);
    await this.competitionService.createFriendly(gameId);
    const championship = await this.competitionService.createChampionship(game);
    await this.trainerRepository.findOneAndUpdate(
      { _id: playerId },
      { $push: { competitions: championship } },
    );
    await this.trainerService.generateTrainerWithPokemon(
      game,
      NB_GENERATED_TRAINER,
      championship,
    );
    const trainers = await this.trainerRepository.list({}, { gameId });
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
      championship,
    );
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGameEnd",
    });
  }
}

export default GameService;
