import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";
import Tournament from "./tournament/Tournament";
import TournamentPopulater from "./tournament/TournamentPopulater";
import Trainer from "../trainer/Trainer";
import TrainerPopulater from "../trainer/TrainerPopulater";

@singleton()
export default class CompetitionPopulater extends Populater {
  constructor(
    private tournamentPopulater: TournamentPopulater,
    private trainerPopulater: TrainerPopulater,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: "tournament",
        model: Tournament,
        populate: this.tournamentPopulater.populate(),
      },
      {
        path: "groups",
        model: Trainer,
        populate: this.trainerPopulater.populate(),
      },
    ];
  }
}
