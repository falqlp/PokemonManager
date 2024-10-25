import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Trainer from "../trainer/Trainer";
import TrainerPopulater from "../trainer/TrainerPopulater";
import { singleton } from "tsyringe";
import Competition from "../competiton/Competition";

@singleton()
export class BattleInstancePopulater extends Populater {
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
      {
        path: "competition",
        model: Competition,
      },
    ];
  }
}
