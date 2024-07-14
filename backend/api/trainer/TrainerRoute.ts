import express from "express";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerMapper from "./TrainerMapper";
import { container } from "tsyringe";
import TrainerService from "../../application/trainer/TrainerService";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router = express.Router();
const service = container.resolve(TrainerService);
const mapper = container.resolve(TrainerMapper);
const repository = container.resolve(TrainerRepository);
const readOnlyRouter = new ReadOnlyRouter(
  repository,
  container.resolve(TrainerMapper),
);

router.get("/player/:id", async (req, res, next) => {
  try {
    const obj = await repository.get(req.params.id);
    res.status(200).json(mapper.mapPlayer(obj));
  } catch (error) {
    next(error);
  }
});

router.put("/update-pc-positions", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    await service.updatePcPosition(
      req.body.trainerId,
      req.body.teamPositions,
      req.body.pcPositions,
      gameId,
    );
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.use("/", readOnlyRouter.router);

export default router;
