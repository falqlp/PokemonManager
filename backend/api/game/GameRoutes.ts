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

router.get("/player/:id", (req, res) => {
  gameRepository
    .get(req.params.id)
    .then((result) =>
      res.status(200).json(trainerMapper.mapPlayer(result.player)),
    )
    .catch(console.log);
});

router.get("/time/:id", (req, res) => {
  gameRepository
    .get(req.params.id)
    .then((result) => res.status(200).json(result.actualDate))
    .catch(console.log);
});

router.post("/init-game", (req, res) => {
  const gameId = req.headers["game-id"] as string;
  gameService
    .initGame(gameId)
    .then(() => res.status(200).json("OK"))
    .catch(console.log);
});

router.post("/:userId", (req, res) => {
  gameService
    .createWithUser(req.body, req.params.userId)
    .then((game) => res.status(200).json(gameMapper.map(game)))
    .catch(console.log);
});

export default router;
