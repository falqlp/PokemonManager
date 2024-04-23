import PcStorage, { IPcStorage } from "./PcStorage";
import CompleteRepository from "../CompleteRepository";
import PcStorageMapper from "./PcStorageMapper";

class PcStorageRepository extends CompleteRepository<IPcStorage> {
  private static instance: PcStorageRepository;
  public static getInstance(): PcStorageRepository {
    if (!PcStorageRepository.instance) {
      PcStorageRepository.instance = new PcStorageRepository(
        PcStorage,
        PcStorageMapper.getInstance(),
      );
    }
    return PcStorageRepository.instance;
  }
}

export default PcStorageRepository;
