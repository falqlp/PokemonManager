import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Trainer from "../trainer/Trainer";
import TrainerPopulater from "../trainer/TrainerPopulater";

class GamePopulater extends Populater {
  private static instance: GamePopulater;

  public static getInstance(): GamePopulater {
    if (!GamePopulater.instance) {
      GamePopulater.instance = new GamePopulater(
        TrainerPopulater.getInstance(),
      );
    }
    return GamePopulater.instance;
  }

  constructor(protected trainerPopulater: TrainerPopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "player",
      model: Trainer,
      populate: this.trainerPopulater.populate(),
    };
  }
}

export default GamePopulater;
