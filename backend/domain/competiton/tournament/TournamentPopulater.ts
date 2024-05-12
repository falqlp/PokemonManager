import Populater from "../../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";
import BattleSerie from "./battleSerie/BattleSerie";
import BattleSeriePopulater from "./battleSerie/BattleSeriePopulater";

@singleton()
export default class TournamentPopulater extends Populater {
  constructor(protected battleSeriePopulater: BattleSeriePopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "tournamentSteps",
      populate: {
        path: "battleSeries",
        model: BattleSerie,
        populate: this.battleSeriePopulater.populate(),
      },
    };
  }
}
