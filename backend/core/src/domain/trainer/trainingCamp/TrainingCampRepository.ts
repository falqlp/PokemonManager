import CompleteRepository from '../../CompleteRepository';
import TrainingCamp, { ITrainingCamp } from './TrainingCamp';
import { Injectable } from '@nestjs/common';
import TrainingCampPopulater from './TrainingCampPopulater';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
class TrainingCampRepository extends CompleteRepository<ITrainingCamp> {
  constructor(
    populater: TrainingCampPopulater,
    @InjectModel(TrainingCamp.modelName)
    protected override readonly schema: Model<ITrainingCamp>,
  ) {
    super(schema, populater);
  }
}

export default TrainingCampRepository;
