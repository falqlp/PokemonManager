import Populater from "../../../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";
import Battle from "../../../battleInstance/Battle";
import Trainer from "../../../trainer/Trainer";
import TrainerPopulater from "../../../trainer/TrainerPopulater";
import { BattleInstancePopulater } from "../../../battleInstance/BattleInstancePopulater";

@singleton()
export default class BattleSeriePopulater extends Populater {
  constructor(
    protected trainerPopulater: TrainerPopulater,
    protected battleInstancePopulater: BattleInstancePopulater,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: "battles",
        model: Battle,
        populate: this.battleInstancePopulater.populate(),
      },
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
