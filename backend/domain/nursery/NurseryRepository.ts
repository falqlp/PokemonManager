import CompleteRepository from "../CompleteRepository";
import Nursery, { INursery } from "./Nursery";
import NurseryPopulater from "./NurseryPopulater";

class NurseryRepository extends CompleteRepository<INursery> {
  private static instance: NurseryRepository;

  public static getInstance(): NurseryRepository {
    if (!NurseryRepository.instance) {
      NurseryRepository.instance = new NurseryRepository(
        Nursery,
        NurseryPopulater.getInstance(),
      );
    }
    return NurseryRepository.instance;
  }

  public async create(dto: INursery): Promise<INursery> {
    if (!dto.step) {
      dto.step = "WISHLIST";
    }
    if (!dto.level) {
      dto.level = 1;
    }
    return super.create(dto);
  }
}

export default NurseryRepository;
