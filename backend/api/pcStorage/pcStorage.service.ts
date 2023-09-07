import PcStorage, { IPcStorage } from "./pcStorage";
import CompleteService from "../CompleteService";
import PcStorageMapper from "./pcStorage.mapper";

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
