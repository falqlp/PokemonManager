import CompleteRepository from "../CompleteRepository";
import TrainingCamp, { ITrainingCamp } from "./TrainingCamp";
import TrainingCampPopulater from "./TrainingCampPopulater";

class TrainingCampRepository extends CompleteRepository<ITrainingCamp> {
  private static instance: TrainingCampRepository;
  public static getInstance(): TrainingCampRepository {
    if (!TrainingCampRepository.instance) {
      TrainingCampRepository.instance = new TrainingCampRepository(
        TrainingCamp,
        TrainingCampPopulater.getInstance(),
      );
    }
    return TrainingCampRepository.instance;
  }
}

export default TrainingCampRepository;
