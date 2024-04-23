import CompleteRepository from "../CompleteRepository";
import Nursery, { INursery } from "./Nursery";
import NurseryMapper from "./NurseryMapper";

class NurseryRepository extends CompleteRepository<INursery> {
  private static instance: NurseryRepository;

  public static getInstance(): NurseryRepository {
    if (!NurseryRepository.instance) {
      NurseryRepository.instance = new NurseryRepository(
        Nursery,
        NurseryMapper.getInstance(),
      );
    }
    return NurseryRepository.instance;
  }
}

export default NurseryRepository;
