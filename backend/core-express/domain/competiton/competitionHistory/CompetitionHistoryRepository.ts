import { singleton } from "tsyringe";
import CompetitionHistory, { ICompetitionHistory } from "./CompetitionHistory";
import CompetitionHistoryPopulater from "./CompetitionHistoryPopulater";
import CompleteRepository from "../../CompleteRepository";

@singleton()
export default class CompetitionHistoryRepository extends CompleteRepository<ICompetitionHistory> {
  constructor(competitionPopulater: CompetitionHistoryPopulater) {
    super(CompetitionHistory, competitionPopulater);
  }
}
