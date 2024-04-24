import PcStorage, { IPcStorage } from "./PcStorage";
import CompleteRepository from "../CompleteRepository";
import PcStoragePopulater from "./PcStoragePopulater";
import { singleton } from "tsyringe";

@singleton()
class PcStorageRepository extends CompleteRepository<IPcStorage> {
  constructor(pcStoragePopulater: PcStoragePopulater) {
    super(PcStorage, pcStoragePopulater);
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
