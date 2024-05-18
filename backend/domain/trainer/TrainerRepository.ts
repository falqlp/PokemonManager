import Trainer, { ITrainer } from "./Trainer";
import CompleteRepository from "../CompleteRepository";
import { FilterQuery, UpdateQuery } from "mongoose";
import { singleton } from "tsyringe";
import TrainerPopulater from "./TrainerPopulater";
import Nursery from "./nursery/Nursery";
import TrainingCamp from "./trainingCamp/TrainingCamp";
import PcStorage from "./pcStorage/PcStorage";
import Pokemon from "../pokemon/Pokemon";

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

  public async updateManyTrainer(
    filter?: FilterQuery<ITrainer>,
    update?: UpdateQuery<ITrainer>,
  ): Promise<void> {
    this.schema.updateMany(filter, update);
  }

  public async deleteTrainer(dto: ITrainer): Promise<ITrainer> {
    Nursery.deleteMany({ _id: dto.nursery._id });
    TrainingCamp.deleteMany({ _id: dto.trainingCamp._id });
    TrainingCamp.deleteMany({ _id: dto.trainingCamp._id });
    PcStorage.deleteMany({ _id: dto.pcStorage._id });
    Pokemon.updateMany({ trainerId: dto._id }, { $unset: { trainerId: "" } });
    return super.delete(dto._id);
  }
}

export default TrainerRepository;
