import Trainer, { ITrainer } from './Trainer';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import TrainerPopulater from './TrainerPopulater';
import { InjectModel } from '@nestjs/mongoose';
import NurseryRepository from './nursery/NurseryRepository';
import TrainingCampRepository from './trainingCamp/TrainingCampRepository';
import PcStorageRepository from './pcStorage/PcStorageRepository';

@Injectable()
class TrainerRepository extends CompleteRepository<ITrainer> {
  constructor(
    trainerPopulater: TrainerPopulater,
    @InjectModel(Trainer.modelName)
    protected override readonly schema: Model<ITrainer>,
    private readonly nurseryRepository: NurseryRepository,
    private readonly trainingCampRepository: TrainingCampRepository,
    private readonly pcStorageRepository: PcStorageRepository,
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
