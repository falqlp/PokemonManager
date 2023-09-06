import Trainer from "./trainer";
import trainerMapper from "./trainer.mapper";
import CompleteService from "../CompleteService";

const TrainerService = {
  ...new CompleteService(Trainer, trainerMapper),
};

export default TrainerService;
