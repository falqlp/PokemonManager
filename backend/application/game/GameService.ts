import { IGame, IPlayer } from "../../domain/game/Game";
import GameRepository from "../../domain/game/GameRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import GenerateCalendarService from "../calendarEvent/GenerateCalendarService";
import { singleton } from "tsyringe";
import CompetitionService from "../competition/CompetitionService";
import { mongoId } from "../../utils/MongoUtils";
import { ITrainer } from "../../domain/trainer/Trainer";
import UserRepository from "../../domain/user/UserRepository";
import WebsocketUtils from "../../websocket/WebsocketUtils";
export const NB_GENERATED_TRAINER = 20;

@singleton()
class GameService {
  constructor(
    private gameRepository: GameRepository,
    private trainerRepository: TrainerRepository,
    private trainerService: TrainerService,
    private generateCalendarService: GenerateCalendarService,
    private competitionService: CompetitionService,
    private userRepository: UserRepository,
    private websocketUtils: WebsocketUtils,
  ) {}

  public async createWithUsers(
    players: IPlayer[],
    name: string,
  ): Promise<IGame> {
    const gameId = mongoId();
    const trainer: ITrainer = { ...players.at(0).trainer, gameId };
    players.at(0).trainer = await this.trainerService.create(trainer);
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getUTCFullYear();
    const actualDate = new Date(Date.UTC(currentYear, 0, 1));
    const newGame = await this.gameRepository.create({
      _id: gameId,
      players,
      name,
      actualDate,
    });
    this.userRepository
      .updateManyUser(
        { _id: { $in: players.map((player) => player.userId) } },
        { $push: { games: newGame._id } },
      )
      .then();
    if (newGame.players.length === 1) {
      setTimeout(() => {
        this.initGame(newGame).then();
      }, 500);
    }
    return newGame;
  }

  public async initGame(game: IGame): Promise<void> {
    this.websocketUtils.sendMessageToClientInGame(game._id, {
      type: "initGame",
      payload: {
        key: "TRAINER_GENERATION",
      },
    });
    await this.competitionService.createFriendly(game._id);
    const championship = await this.competitionService.createChampionship(
      game,
      3,
    );
    await this.trainerRepository.updateManyTrainer(
      {
        _id: {
          $in: game.players.map((player) => player.trainer._id.toString()),
        },
      },
      { $push: { competitions: championship } },
    );
    await this.trainerService.generateTrainerWithPokemon(
      game,
      NB_GENERATED_TRAINER - game.players.length,
      championship,
    );
    const trainers = await this.trainerRepository.list(
      {},
      { gameId: game._id },
    );
    this.websocketUtils.sendMessageToClientInGame(game._id, {
      type: "initGame",
      payload: {
        key: "CALENDAR_GENERATION",
      },
    });
    await this.generateCalendarService.generateChampionship(
      trainers,
      3,
      game._id,
      championship,
    );
    this.websocketUtils.sendMessageToClientInGame(game._id, {
      type: "initGameEnd",
    });
  }

  public async initIfNot(gameId: string): Promise<void> {
    const trainers = await this.trainerRepository.list({ custom: { gameId } });
    if (trainers.length !== NB_GENERATED_TRAINER) {
      const game = await this.gameRepository.get(gameId);
      await this.initGame(game);
    }
  }

  public async addPlayerToGame(game: IGame, userId: string): Promise<ITrainer> {
    let initGame = false;
    if (!game.players.some((player) => !player.trainer)) {
      initGame = true;
    }
    const index = game.players.findIndex(
      (gamePlayer) => gamePlayer.userId === userId,
    );
    if (index !== -1) {
      game.players[index].trainer = await this.trainerService.create({
        ...game.players[index].trainer,
        gameId: game._id,
      });
    } else {
      throw new Error("Player not found");
    }
    await this.gameRepository.update(game._id, game);
    if (initGame) {
      setTimeout(() => {
        this.initGame(game).then();
      }, 500);
    }
    return game.players[index].trainer;
  }

  public async deleteGameForUser(
    gameId: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository.get(userId);
    const game = await this.gameRepository.get(gameId);
    if (user && game) {
      game.players = game.players.filter(
        (player) => player.userId.toString() !== userId,
      );
      user.games = user.games.filter(
        (userGame) => userGame._id.toString() !== gameId,
      );
      if (game.players.length === 0) {
        await this.gameRepository.delete(gameId);
      } else {
        await this.gameRepository.update(gameId, game);
      }
      await this.userRepository.update(userId, user);
    }
  }
}

export default GameService;
