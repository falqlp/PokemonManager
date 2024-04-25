import express from "express";
import CompleteRouter from "../CompleteRouter";
import GameRepository from "../../domain/game/GameRepository";
import GameService from "../../application/game/GameService";
import TrainerMapper from "../trainer/TrainerMapper";
import GameMapper from "./GameMapper";
import { container } from "tsyringe";
const gameRepository = container.resolve(GameRepository);
const gameService = container.resolve(GameService);
const trainerMapper = container.resolve(TrainerMapper);
const gameMapper = container.resolve(GameMapper);
const router = express.Router();
const completeRouter = new CompleteRouter(gameRepository, gameMapper);

router.use("/", completeRouter.router);

router.get("/player/:id", async (req, res, next) => {
  try {
    const obj = await gameRepository.get(req.params.id);
    res.status(200).json(trainerMapper.mapPlayer(obj.player));
  } catch (error) {
    next(error);
  }
});

router.get("/time/:id", async (req, res, next) => {
  try {
    const obj = await gameRepository.get(req.params.id);
    res.status(200).json(obj.actualDate);
  } catch (error) {
    next(error);
  }
});

router.post("/init-game", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    await gameService.initGame(gameId, req.body.playerId);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.post("/:userId", async (req, res, next) => {
  try {
    const obj = await gameService.createWithUser(req.body, req.params.userId);
    res.status(200).json(gameMapper.map(obj));
  } catch (error) {
    next(error);
  }
});

export default router;
