import { Injectable } from '@nestjs/common';
import CompetitionHistory, { ICompetitionHistory } from './CompetitionHistory';
import CompetitionHistoryPopulater from './CompetitionHistoryPopulater';
import CompleteRepository from '../../CompleteRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export default class CompetitionHistoryRepository extends CompleteRepository<ICompetitionHistory> {
  constructor(
    competitionPopulater: CompetitionHistoryPopulater,
    @InjectModel(CompetitionHistory.modelName)
    protected override readonly schema: Model<ICompetitionHistory>,
  ) {
    super(schema, competitionPopulater);
  }
}
