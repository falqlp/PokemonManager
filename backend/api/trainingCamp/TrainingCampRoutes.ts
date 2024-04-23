import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainingCampRepository from "../../domain/trainingCamp/TrainingCampRepository";

const router = express.Router();
const completeRouter = new CompleteRouter(TrainingCampRepository.getInstance());

router.use("/", completeRouter.router);

export default router;
