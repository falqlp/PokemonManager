import { singleton } from "tsyringe";
import Competition, { ICompetition } from "./Competition";
import CompetitionPopulater from "./CompetitionPopulater";
import CompleteRepository from "../CompleteRepository";
import Trainer from "../trainer/Trainer";

@singleton()
export default class CompetitionRepository extends CompleteRepository<ICompetition> {
  constructor(competitionPopulater: CompetitionPopulater) {
    super(Competition, competitionPopulater);
  }

  public async archiveMany(ids: string[]): Promise<void> {
    await Trainer.updateMany({}, { $pull: { competitions: { $in: ids } } });
  }
}
