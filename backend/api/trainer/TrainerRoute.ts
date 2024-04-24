import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerMapper from "./TrainerMapper";
import { container } from "tsyringe";

const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(TrainerRepository),
  container.resolve(TrainerMapper),
);

router.use("/", completeRouter.router);

export default router;
