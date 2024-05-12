import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerMapper from "./TrainerMapper";
import { container } from "tsyringe";
import TrainerService from "../../application/trainer/TrainerService";

const router = express.Router();
const service = container.resolve(TrainerService);
const mapper = container.resolve(TrainerMapper);
const completeRouter = new CompleteRouter(
  container.resolve(TrainerRepository),
  container.resolve(TrainerMapper),
);

router.put("/:id", async (req, res, next) => {
  try {
    const obj = await service.update(req.body);
    res.status(200).json(mapper.map(obj));
  } catch (error) {
    next(error);
  }
});

router.use("/", completeRouter.router);

export default router;
