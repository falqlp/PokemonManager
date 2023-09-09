import Trainer, { ITrainer } from "./trainer";
import CompleteService from "../CompleteService";
import TrainerMapper from "./trainer.mapper";

class TrainerService extends CompleteService<ITrainer> {
  private static instance: TrainerService;
  public static getInstance(): TrainerService {
    if (!TrainerService.instance) {
      TrainerService.instance = new TrainerService(
        Trainer,
        TrainerMapper.getInstance()
      );
    }
    return TrainerService.instance;
  }
}

export default TrainerService;
