import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainerRepository from "../../domain/trainer/TrainerRepository";

const router = express.Router();
const completeRouter = new CompleteRouter(TrainerRepository.getInstance());

router.use("/", completeRouter.router);

export default router;
