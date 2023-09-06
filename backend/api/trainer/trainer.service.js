import Trainer from "./trainer";

const trainerMapper = require("./trainer.mapper");
const CompleteService = require("../CompleteService");

const TrainerService = {
  ...new CompleteService(Trainer, trainerMapper),
};
module.exports = TrainerService;
