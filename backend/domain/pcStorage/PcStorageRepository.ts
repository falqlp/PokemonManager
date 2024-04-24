import PcStorage, { IPcStorage } from "./PcStorage";
import CompleteRepository from "../CompleteRepository";
import PcStoragePopulater from "./PcStoragePopulater";

class PcStorageRepository extends CompleteRepository<IPcStorage> {
  private static instance: PcStorageRepository;
  public static getInstance(): PcStorageRepository {
    if (!PcStorageRepository.instance) {
      PcStorageRepository.instance = new PcStorageRepository(
        PcStorage,
        PcStoragePopulater.getInstance(),
      );
    }
    return PcStorageRepository.instance;
  }

  public async create(dto: IPcStorage): Promise<IPcStorage> {
    if (!dto.storage) {
      dto.storage = [];
    }
    if (!dto.maxSize) {
      dto.maxSize = 0;
    }
    return super.create(dto);
  }
}

export default PcStorageRepository;
