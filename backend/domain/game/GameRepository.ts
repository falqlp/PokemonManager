import CompleteRepository from "../CompleteRepository";
import Game, { IGame } from "./Game";
import User from "../user/User";
import Trainer from "../trainer/Trainer";
import Pokemon from "../pokemon/Pokemon";
import TrainingCamp from "../trainer/trainingCamp/TrainingCamp";
import Battle from "../battleInstance/Battle";
import CalendarEvent from "../calendarEvent/CalendarEvent";
import PcStorage from "../trainer/pcStorage/PcStorage";
import Nursery from "../trainer/nursery/Nursery";
import { singleton } from "tsyringe";
import GamePopulater from "./GamePopulater";
import Competition from "../competiton/Competition";
import Tournament from "../competiton/tournament/Tournament";
import CompetitionHistory from "../competiton/competitionHistory/CompetitionHistory";

@singleton()
class GameRepository extends CompleteRepository<IGame> {
  constructor(gamePopulater: GamePopulater) {
    super(Game, gamePopulater);
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
      await Competition.deleteMany({ gameId: _id });
      await Tournament.deleteMany({ gameId: _id });
      await CompetitionHistory.deleteMany({ gameId: _id });
    } catch (error) {
      return Promise.reject(error);
    }
    return super.delete(_id);
  }

  public async updatePlayingTime(
    gameId: string,
    trainerId: string,
    sessionTime: number,
  ): Promise<IGame> {
    if (sessionTime) {
      const game = await this.get(gameId);
      if (game.players) {
        game.players.find(
          (player) => player.trainer?._id.toString() === trainerId,
        ).playingTime += sessionTime;
      }
      return await this.update(game._id, game);
    }
  }
}

export default GameRepository;
