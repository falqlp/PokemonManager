import CompleteService from "../CompleteService";
import Nursery, { INursery } from "./nursery";
import NurseryMapper from "./nursery.mapper";

class NurseryService extends CompleteService<INursery> {
  private static instance: NurseryService;
  public static getInstance(): NurseryService {
    if (!NurseryService.instance) {
      NurseryService.instance = new NurseryService(
        Nursery,
        NurseryMapper.getInstance()
      );
    }
    return NurseryService.instance;
  }
}

export default NurseryService;
