import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Trainer from "../trainer/Trainer";
import TrainerPopulater from "../trainer/TrainerPopulater";
import { singleton } from "tsyringe";

@singleton()
class GamePopulater extends Populater {
  constructor(protected trainerPopulater: TrainerPopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "players.trainer",
      model: Trainer,
      populate: this.trainerPopulater.populate(),
    };
  }
}

export default GamePopulater;
