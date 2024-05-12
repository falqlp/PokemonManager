import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainingCampRepository from "../../domain/trainer/trainingCamp/TrainingCampRepository";
import TrainingCampMapper from "./TrainingCampMapper";
import { container } from "tsyringe";

const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(TrainingCampRepository),
  container.resolve(TrainingCampMapper),
);

router.use("/", completeRouter.router);

export default router;
