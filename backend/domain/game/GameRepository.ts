import CompleteRepository from "../CompleteRepository";
import Game, { IGame } from "./Game";
import User from "../user/User";
import Trainer from "../trainer/Trainer";
import Pokemon from "../pokemon/Pokemon";
import TrainingCamp from "../trainingCamp/TrainingCamp";
import Battle from "../battleInstance/Battle";
import CalendarEvent from "../calendarEvent/CalendarEvent";
import PcStorage from "../pcStorage/PcStorage";
import Nursery from "../nursery/Nursery";
import GamePopulater from "./GamePopulater";

class GameRepository extends CompleteRepository<IGame> {
  private static instance: GameRepository;
  public static getInstance(): GameRepository {
    if (!GameRepository.instance) {
      GameRepository.instance = new GameRepository(
        Game,
        GamePopulater.getInstance(),
      );
    }
    return GameRepository.instance;
  }

  public async delete(_id: string): Promise<IGame> {
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
