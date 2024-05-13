import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";
import Tournament from "./tournament/Tournament";
import TournamentPopulater from "./tournament/TournamentPopulater";

@singleton()
export default class CompetitionPopulater extends Populater {
  constructor(private tournamentPopulater: TournamentPopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "tournament",
      model: Tournament,
      populate: this.tournamentPopulater.populate(),
    };
  }
}
