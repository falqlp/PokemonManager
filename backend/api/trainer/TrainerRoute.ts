import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerMapper from "./TrainerMapper";

const router = express.Router();
const completeRouter = new CompleteRouter(
  TrainerRepository.getInstance(),
  TrainerMapper.getInstance(),
);

router.use("/", completeRouter.router);

export default router;
