import CompleteService from "../../api/CompleteService";
import Game, { IGame } from "./Game";
import GameMapper from "./GameMapper";
import { Model } from "mongoose";
import TrainerRepository from "../trainer/TrainerRepository";
import User from "../../api/user/User";
import Trainer from "../trainer/Trainer";
import Pokemon from "../../api/pokemon/Pokemon";
import TrainingCamp from "../../api/trainingCamp/TrainingCamp";
import Battle from "../../api/battle-instance/Battle";
import CalendarEvent from "../../api/calendar-event/CalendarEvent";
import PcStorage from "../../api/pcStorage/PcStorage";

class GameRepository extends CompleteService<IGame> {
  private static instance: GameRepository;
  public static getInstance(): GameRepository {
    if (!GameRepository.instance) {
      GameRepository.instance = new GameRepository(
        Game,
        GameMapper.getInstance()
      );
    }
    return GameRepository.instance;
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

export default GameRepository;
