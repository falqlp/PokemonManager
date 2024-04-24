import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainingCampRepository from "../../domain/trainingCamp/TrainingCampRepository";
import TrainingCampMapper from "./TrainingCampMapper";

const router = express.Router();
const completeRouter = new CompleteRouter(
  TrainingCampRepository.getInstance(),
  TrainingCampMapper.getInstance(),
);

router.use("/", completeRouter.router);

export default router;
