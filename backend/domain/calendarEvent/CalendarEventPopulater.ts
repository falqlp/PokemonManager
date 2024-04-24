import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Battle from "../battleInstance/Battle";
import Trainer from "../trainer/Trainer";
import { BattleInstancePopulater } from "../battleInstance/BattleInstancePopulater";
import TrainerPopulater from "../trainer/TrainerPopulater";
import { singleton } from "tsyringe";

@singleton()
class CalendarEventPopulater extends Populater {
  constructor(
    protected battleInstancePopulater: BattleInstancePopulater,
    protected trainerPopulater: TrainerPopulater,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: "event",
        model: Battle,
        populate: this.battleInstancePopulater.populate(),
      },
      {
        path: "trainers",
        model: Trainer,
        populate: this.trainerPopulater.populate(),
      },
    ];
  }
}

export default CalendarEventPopulater;
