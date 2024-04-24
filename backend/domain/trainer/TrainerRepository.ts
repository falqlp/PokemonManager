import Trainer, { ITrainer } from "./Trainer";
import CompleteRepository from "../CompleteRepository";
import { FilterQuery, UpdateQuery } from "mongoose";
import TrainerPopulater from "./TrainerPopulater";

class TrainerRepository extends CompleteRepository<ITrainer> {
  private static instance: TrainerRepository;

  public static getInstance(): TrainerRepository {
    if (!TrainerRepository.instance) {
      TrainerRepository.instance = new TrainerRepository(
        Trainer,
        TrainerPopulater.getInstance(),
      );
    }
    return TrainerRepository.instance;
  }

  public async findOneAndUpdate(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<ITrainer> {
    return this.schema.findOneAndUpdate(filter, update);
  }
}

export default TrainerRepository;
