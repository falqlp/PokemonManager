import { singleton } from "tsyringe";
import Competition, { ICompetition } from "./Competition";
import CompetitionPopulater from "./CompetitionPopulater";
import CompleteRepository from "../CompleteRepository";

@singleton()
export default class CompetitionRepository extends CompleteRepository<ICompetition> {
  constructor(competitionPopulater: CompetitionPopulater) {
    super(Competition, competitionPopulater);
  }
}
