import CompleteRepository from "../../CompleteRepository";
import TrainingCamp, { ITrainingCamp } from "./TrainingCamp";
import { singleton } from "tsyringe";
import TrainingCampPopulater from "./TrainingCampPopulater";

@singleton()
class TrainingCampRepository extends CompleteRepository<ITrainingCamp> {
  constructor(populater: TrainingCampPopulater) {
    super(TrainingCamp, populater);
  }
}

export default TrainingCampRepository;
