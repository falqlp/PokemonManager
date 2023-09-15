import Trainer, { ITrainer } from "./trainer";
import CompleteService from "../CompleteService";
import TrainerMapper from "./trainer.mapper";
import { ListBody } from "../ReadOnlyService";

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

  public async getPartial(_id: string): Promise<ITrainer> {
    return this.get(_id, this.mapper.mapPartial);
  }

  public async listPartial(body: ListBody): Promise<ITrainer[]> {
    return this.list(body, this.mapper.mapPartial);
  }

  public async getComplete(_id: string): Promise<ITrainer> {
    return this.get(_id, this.mapper.mapComplete);
  }

  public async listComplete(body: ListBody): Promise<ITrainer[]> {
    return this.list(body, this.mapper.mapComplete);
  }
}

export default TrainerService;
