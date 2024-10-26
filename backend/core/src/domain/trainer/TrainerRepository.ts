import Trainer, { ITrainer } from './Trainer';
import CompleteRepository from '../CompleteRepository';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import TrainerPopulater from './TrainerPopulater';
import Nursery from './nursery/Nursery';
import TrainingCamp from './trainingCamp/TrainingCamp';
import PcStorage from './pcStorage/PcStorage';
import Pokemon from '../pokemon/Pokemon';
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
    return this.schema.findOneAndUpdate(filter, update);
  }

  public async updateManyTrainer(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<void> {
    await this.schema.updateMany(filter, update);
  }

  public async deleteTrainer(dto: ITrainer): Promise<ITrainer> {
    Nursery.deleteMany({ _id: dto.nursery._id });
    TrainingCamp.deleteMany({ _id: dto.trainingCamp._id });
    TrainingCamp.deleteMany({ _id: dto.trainingCamp._id });
    PcStorage.deleteMany({ _id: dto.pcStorage._id });
    Pokemon.updateMany({ trainerId: dto._id }, { $unset: { trainerId: '' } });
    return super.delete(dto._id);
  }

  public async relegate(ids: string[], gameId: string): Promise<void> {
    await this.schema.updateMany(
      { _id: { $in: ids }, gameId },
      { $inc: { division: 1 } },
    );
  }

  public async promote(ids: string[], gameId: string): Promise<void> {
    await this.schema.updateMany(
      { _id: { $in: ids }, gameId },
      { $inc: { division: -1 } },
    );
  }
}

export default TrainerRepository;
