import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Trainer from "../trainer/Trainer";
import TrainerPopulater from "../trainer/TrainerPopulater";

export class BattleInstancePopulater extends Populater {
  private static instance: BattleInstancePopulater;
  public static getInstance(): BattleInstancePopulater {
    if (!BattleInstancePopulater.instance) {
      BattleInstancePopulater.instance = new BattleInstancePopulater(
        TrainerPopulater.getInstance(),
      );
    }
    return BattleInstancePopulater.instance;
  }

  constructor(protected trainerPopulater: TrainerPopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: "player",
        model: Trainer,
        populate: this.trainerPopulater.populate(),
      },
      {
        path: "opponent",
        model: Trainer,
        populate: this.trainerPopulater.populate(),
      },
    ];
  }
}
