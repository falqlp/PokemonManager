import PcStorage, { IPcStorage } from "./PcStorage";
import CompleteService from "../CompleteService";
import PcStorageMapper from "./PcStorageMapper";

class pcStorageService extends CompleteService<IPcStorage> {
  private static instance: pcStorageService;
  public static getInstance(): pcStorageService {
    if (!pcStorageService.instance) {
      pcStorageService.instance = new pcStorageService(
        PcStorage,
        PcStorageMapper.getInstance()
      );
    }
    return pcStorageService.instance;
  }
}

export default pcStorageService;
