import express from "express";
import TrainingCampRepository from "../../domain/trainer/trainingCamp/TrainingCampRepository";
import TrainingCampMapper from "./TrainingCampMapper";
import { container } from "tsyringe";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router = express.Router();
const readOnlyRouter = new ReadOnlyRouter(
  container.resolve(TrainingCampRepository),
  container.resolve(TrainingCampMapper),
);

router.use("/", readOnlyRouter.router);

export default router;
