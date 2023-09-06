import PcStorage from "./pcStorage";

const pcStorageMapper = require("./pcStorage.mapper");
const CompleteService = require("../CompleteService");

const pcStorageService = {
  ...new CompleteService(PcStorage, pcStorageMapper),
};
module.exports = pcStorageService;
