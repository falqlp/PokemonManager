import ReadOnlyService from "../../api/ReadOnlyService";
import TrainerClass, { ITrainerClass } from "./TrainerClass";
import TrainerClassMapper from "./TrainerClassMapper";

class TrainerClassRepository extends ReadOnlyService<ITrainerClass> {
  private static instance: TrainerClassRepository;

  public static getInstance(): TrainerClassRepository {
    if (!TrainerClassRepository.instance) {
      TrainerClassRepository.instance = new TrainerClassRepository(
        TrainerClass,
        TrainerClassMapper.getInstance()
      );
    }
    return TrainerClassRepository.instance;
  }
}

export default TrainerClassRepository;
