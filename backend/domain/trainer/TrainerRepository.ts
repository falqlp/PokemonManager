import Trainer, { ITrainer } from "./Trainer";
import CompleteService from "../../api/CompleteService";
import TrainerMapper from "./TrainerMapper";
import { Model } from "mongoose";

class TrainerRepository extends CompleteService<ITrainer> {
  private static instance: TrainerRepository;

  constructor(trainer: Model<ITrainer>, protected mapper: TrainerMapper) {
    super(trainer, mapper);
  }
  public static getInstance(): TrainerRepository {
    if (!TrainerRepository.instance) {
      TrainerRepository.instance = new TrainerRepository(
        Trainer,
        TrainerMapper.getInstance()
      );
    }
    return TrainerRepository.instance;
  }

  public async getComplete(_id: string): Promise<ITrainer> {
    return this.get(_id, { map: this.mapper.mapComplete });
  }
}

export default TrainerRepository;
