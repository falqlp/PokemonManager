import { Injectable } from '@nestjs/common';
import Competition, { ICompetition } from './Competition';
import CompetitionPopulater from './CompetitionPopulater';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import TrainerRepository from '../trainer/TrainerRepository';

@Injectable()
export default class CompetitionRepository extends CompleteRepository<ICompetition> {
  constructor(
    competitionPopulater: CompetitionPopulater,
    @InjectModel(Competition.modelName)
    protected override readonly schema: Model<ICompetition>,
    private readonly trainerRepository: TrainerRepository,
  ) {
    super(schema, competitionPopulater);
  }

  public async archiveMany(ids: string[]): Promise<void> {
    await this.trainerRepository.updateMany(
      {},
      { $pull: { competitions: { $in: ids } } },
    );
  }
}
