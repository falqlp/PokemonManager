import TrainerClass, { ITrainerClass } from './TrainerClass';
import { Aggregate, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class TrainerClassRepository {
  constructor(
    @InjectModel(TrainerClass.modelName)
    protected readonly schema: Model<ITrainerClass>,
  ) {}
  public generateTrainerName(): Aggregate<
    Array<{ class: string; name: string }>
  > {
    return this.schema
      .aggregate()
      .sample(1)
      .lookup({
        from: 'trainernames',
        localField: 'gender',
        foreignField: 'gender',
        as: 'result',
      })
      .addFields({
        randomResult: {
          $arrayElemAt: [
            '$result',
            { $floor: { $multiply: [{ $size: '$result' }, Math.random()] } },
          ],
        },
      })
      .project({
        _id: 0,
        class: 1,
        name: '$randomResult.name',
      });
  }
}

export default TrainerClassRepository;
