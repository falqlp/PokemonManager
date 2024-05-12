import { singleton } from "tsyringe";
import Tournament, { ITournament } from "./Tournament";
import TournamentPopulater from "./TournamentPopulater";
import CompleteRepository from "../../CompleteRepository";

@singleton()
export default class TournamentRepository extends CompleteRepository<ITournament> {
  constructor(protected tournamentPopulater: TournamentPopulater) {
    super(Tournament, tournamentPopulater);
  }

  public async getUpdateTournaments(
    targetDate: Date,
    gameId: string,
  ): Promise<ITournament[]> {
    const tournamentsAggregation = this.schema
      .aggregate<ITournament>()
      .match({ tournamentSteps: { $exists: true, $ne: [] }, gameId })
      .addFields({
        lastStep: { $arrayElemAt: ["$tournamentSteps", -1] },
      })
      .match({ "lastStep.endDate": targetDate });
    return this.schema.populate(
      await tournamentsAggregation.exec(),
      this.tournamentPopulater.populate(),
    );
  }
}
