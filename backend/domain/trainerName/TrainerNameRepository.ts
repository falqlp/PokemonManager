import ReadOnlyService from "../../api/ReadOnlyService";
import TrainerNameMapper from "./TrainerNameMapper";
import TrainerName, { ITrainerName } from "./TrainerName";

class TrainerNameRepository extends ReadOnlyService<ITrainerName> {
  private static instance: TrainerNameRepository;

  public static getInstance(): TrainerNameRepository {
    if (!TrainerNameRepository.instance) {
      TrainerNameRepository.instance = new TrainerNameRepository(
        TrainerName,
        TrainerNameMapper.getInstance()
      );
    }
    return TrainerNameRepository.instance;
  }
}

export default TrainerNameRepository;
