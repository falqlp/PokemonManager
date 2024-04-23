import Trainer, { ITrainer } from "./Trainer";
import CompleteRepository from "../CompleteRepository";
import TrainerMapper from "./TrainerMapper";
import { FilterQuery, Model, UpdateQuery } from "mongoose";

class TrainerRepository extends CompleteRepository<ITrainer> {
  private static instance: TrainerRepository;

  constructor(
    trainer: Model<ITrainer>,
    protected mapper: TrainerMapper,
  ) {
    super(trainer, mapper);
  }

  public static getInstance(): TrainerRepository {
    if (!TrainerRepository.instance) {
      TrainerRepository.instance = new TrainerRepository(
        Trainer,
        TrainerMapper.getInstance(),
      );
    }
    return TrainerRepository.instance;
  }

  public async getComplete(_id: string): Promise<ITrainer> {
    return this.get(_id, { map: this.mapper.mapComplete });
  }

  public async findOneAndUpdate(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<ITrainer> {
    return this.schema.findOneAndUpdate(filter, update);
  }
}

export default TrainerRepository;
