import CompleteRepository from "../CompleteRepository";
import Nursery, { INursery } from "./Nursery";
import { singleton } from "tsyringe";
import NurseryPopulater from "./NurseryPopulater";

@singleton()
class NurseryRepository extends CompleteRepository<INursery> {
  constructor(nurseryPopulater: NurseryPopulater) {
    super(Nursery, nurseryPopulater);
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
