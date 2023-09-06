import PcStorage from "./pcStorage";
import pcStorageMapper from "./pcStorage.mapper";
import CompleteService from "../CompleteService";

const pcStorageService = {
  ...new CompleteService(PcStorage, pcStorageMapper),
};

export default pcStorageService;
