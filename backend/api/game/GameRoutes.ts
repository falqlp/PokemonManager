import express from "express";
import CompleteRouter from "../CompleteRouter";
import GameRepository from "../../domain/game/GameRepository";
import GameService from "../../application/game/GameService";
import GameMapper from "./GameMapper";
import { container } from "tsyringe";
import TrainerMapper from "../trainer/TrainerMapper";
const gameRepository = container.resolve(GameRepository);
const gameService = container.resolve(GameService);
const gameMapper = container.resolve(GameMapper);
const trainerMapper = container.resolve(TrainerMapper);
const router = express.Router();
const completeRouter = new CompleteRouter(gameRepository, gameMapper);

router.get("/time/:id", async (req, res, next) => {
  try {
    const obj = await gameRepository.get(req.params.id);
    res.status(200).json(obj.actualDate);
  } catch (error) {
    next(error);
  }
});

router.post("/delete-game", async (req, res, next) => {
  try {
    await gameService.deleteGameForUser(req.body.gameId, req.body.userId);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.post("/:userId", async (req, res, next) => {
  try {
    const obj = await gameService.createWithUsers(req.body, req.params.userId);
    res.status(200).json(gameMapper.map(obj));
  } catch (error) {
    next(error);
  }
});

router.put("/add-player-to-game", async (req, res, next) => {
  try {
    const obj = await gameService.addPlayerToGame(
      req.body.game,
      req.body.userId,
    );
    res.status(200).json(trainerMapper.map(obj));
  } catch (error) {
    next(error);
  }
});

router.get("/init-if-not/:id", async (req, res, next) => {
  try {
    await gameService.initIfNot(req.params.id);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.use("/", completeRouter.router);

export default router;
