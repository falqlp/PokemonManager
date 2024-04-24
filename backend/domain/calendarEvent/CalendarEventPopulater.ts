import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Battle from "../battleInstance/Battle";
import Trainer from "../trainer/Trainer";
import { BattleInstancePopulater } from "../battleInstance/BattleInstancePopulater";
import TrainerPopulater from "../trainer/TrainerPopulater";

class CalendarEventPopulater extends Populater {
  private static instance: CalendarEventPopulater;

  public static getInstance(): CalendarEventPopulater {
    if (!CalendarEventPopulater.instance) {
      CalendarEventPopulater.instance = new CalendarEventPopulater(
        BattleInstancePopulater.getInstance(),
        TrainerPopulater.getInstance(),
      );
    }
    return CalendarEventPopulater.instance;
  }

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
