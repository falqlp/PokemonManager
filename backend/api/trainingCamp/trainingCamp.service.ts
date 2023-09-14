import CompleteService from "../CompleteService";
import TrainingCamp, { ITrainingCamp } from "./trainingCamp";
import TrainingCampMapper from "./trainingCamp.mapper";

class TrainingCampService extends CompleteService<ITrainingCamp> {
  private static instance: TrainingCampService;
  public static getInstance(): TrainingCampService {
    if (!TrainingCampService.instance) {
      TrainingCampService.instance = new TrainingCampService(
        TrainingCamp,
        TrainingCampMapper.getInstance()
      );
    }
    return TrainingCampService.instance;
  }
}

export default TrainingCampService;
