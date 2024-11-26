import Trainer, { ITrainer } from './Trainer';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import TrainerPopulater from './TrainerPopulater';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class TrainerRepository extends CompleteRepository<ITrainer> {
  constructor(
    trainerPopulater: TrainerPopulater,
    @InjectModel(Trainer.modelName)
    protected override readonly schema: Model<ITrainer>,
  ) {
    super(schema, trainerPopulater);
  }

  public async findOneAndUpdate(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<ITrainer> {
    return this.schema.findOneAndUpdate(filter, update).exec();
  }

  public async updateManyTrainer(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<void> {
    await this.schema.updateMany(filter, update).exec();
  }

  public async updateTrainer(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<void> {
    await this.schema.updateOne(filter, update).exec();
  }

  public async relegate(ids: string[], gameId: string): Promise<void> {
    await this.schema
      .updateMany({ _id: { $in: ids }, gameId }, { $inc: { division: 1 } })
      .exec();
  }

  public async promote(ids: string[], gameId: string): Promise<void> {
    await this.schema
      .updateMany({ _id: { $in: ids }, gameId }, { $inc: { division: -1 } })
      .exec();
  }
}

export default TrainerRepository;
