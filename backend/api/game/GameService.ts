import CompleteService from "../CompleteService";
import Game, { IGame } from "./Game";
import GameMapper from "./GameMapper";
import { Model } from "mongoose";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import User from "../user/User";
import Trainer from "../../domain/trainer/Trainer";
import Pokemon from "../pokemon/Pokemon";
import TrainingCamp from "../trainingCamp/TrainingCamp";
import Battle from "../battle-instance/Battle";
import CalendarEvent from "../calendar-event/CalendarEvent";
import PcStorage from "../pcStorage/PcStorage";

class GameService extends CompleteService<IGame> {
  private static instance: GameService;

  constructor(
    schema: Model<IGame>,
    mapper: GameMapper,
    protected trainerService: TrainerRepository
  ) {
    super(schema, mapper);
  }
  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService(
        Game,
        GameMapper.getInstance(),
        TrainerRepository.getInstance()
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

  public async delete(_id: string) {
    try {
      await User.updateMany({}, { $pull: { games: _id } });
      await Trainer.deleteMany({ gameId: _id });
      await Pokemon.deleteMany({ gameId: _id });
      await TrainingCamp.deleteMany({ gameId: _id });
      await Battle.deleteMany({ gameId: _id });
      await CalendarEvent.deleteMany({ gameId: _id });
      await PcStorage.deleteMany({ gameId: _id });
    } catch (error) {
      return Promise.reject(error);
    }
    return super.delete(_id);
  }
}

export default GameService;
