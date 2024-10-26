import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import Populater from '../../Populater';
import CompetitionHistory, { ICompetitionHistory } from './CompetitionHistory';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export default class CompetitionHistoryPopulater extends Populater<ICompetitionHistory> {
  constructor(
    @InjectModel(CompetitionHistory.modelName)
    public readonly schema: Model<ICompetitionHistory>,
  ) {
    super();
  }
  public populate(): PopulateOptions | PopulateOptions[] {
    return '' as unknown as PopulateOptions;
  }
}
