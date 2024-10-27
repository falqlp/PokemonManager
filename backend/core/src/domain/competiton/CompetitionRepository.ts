import { Injectable } from '@nestjs/common';
import Competition, { ICompetition } from './Competition';
import CompetitionPopulater from './CompetitionPopulater';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import Trainer from '../trainer/Trainer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export default class CompetitionRepository extends CompleteRepository<ICompetition> {
  constructor(
    competitionPopulater: CompetitionPopulater,
    @InjectModel(Competition.modelName)
    protected override readonly schema: Model<ICompetition>,
  ) {
    super(schema, competitionPopulater);
  }

  public async archiveMany(ids: string[]): Promise<void> {
    await Trainer.updateMany({}, { $pull: { competitions: { $in: ids } } });
  }
}
