import CompleteService from "../../api/CompleteService";
import Game, { IGame } from "./Game";
import GameMapper from "./GameMapper";
import User from "../../api/user/User";
import Trainer from "../trainer/Trainer";
import Pokemon from "../../api/pokemon/Pokemon";
import TrainingCamp from "../../api/trainingCamp/TrainingCamp";
import Battle from "../battleInstance/Battle";
import CalendarEvent from "../calendarEvent/CalendarEvent";
import PcStorage from "../../api/pcStorage/PcStorage";
import Nursery from "../../api/nursery/Nursery";

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
      await Nursery.deleteMany({ gameId: _id });
    } catch (error) {
      return Promise.reject(error);
    }
    return super.delete(_id);
  }
}

export default GameRepository;
