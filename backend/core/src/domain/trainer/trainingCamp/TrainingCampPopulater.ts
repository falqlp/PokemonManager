import Populater from '../../Populater';
import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import TrainingCamp, { ITrainingCamp } from './TrainingCamp';

@Injectable()
class TrainingCampPopulater extends Populater<ITrainingCamp> {
  constructor(
    @InjectModel(TrainingCamp.modelName)
    public readonly schema: Model<ITrainingCamp>,
  ) {
    super();
  }
  public populate(): PopulateOptions | PopulateOptions[] {
    return '' as unknown as PopulateOptions;
  }
}

export default TrainingCampPopulater;
