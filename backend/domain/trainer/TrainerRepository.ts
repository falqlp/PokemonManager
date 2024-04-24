import Trainer, { ITrainer } from "./Trainer";
import CompleteRepository from "../CompleteRepository";
import { FilterQuery, UpdateQuery } from "mongoose";
import { singleton } from "tsyringe";
import TrainerPopulater from "./TrainerPopulater";

@singleton()
class TrainerRepository extends CompleteRepository<ITrainer> {
  constructor(trainerPopulater: TrainerPopulater) {
    super(Trainer, trainerPopulater);
  }

  public async findOneAndUpdate(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<ITrainer> {
    return this.schema.findOneAndUpdate(filter, update);
  }
}

export default TrainerRepository;
