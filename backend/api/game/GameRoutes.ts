import express from "express";
import CompleteRouter from "../CompleteRouter";
import GameRepository from "../../domain/game/GameRepository";
import GameMapper from "../../domain/game/GameMapper";
import GameService from "../../application/game/GameService";
const gameRepository = GameRepository.getInstance();
const gameService = GameService.getInstance();
const gameMapper = GameMapper.getInstance();
const router = express.Router();
const completeRouter = new CompleteRouter(gameRepository);

router.use("/", completeRouter.router);

router.get("/player/:id", (req, res, next) => {
  gameRepository
    .get(req.params.id, { map: gameMapper.mapPlayer })
    .then((result) => res.status(200).json(result.player))
    .catch(console.log);
});

router.get("/time/:id", (req, res, next) => {
  gameRepository
    .get(req.params.id)
    .then((result) => res.status(200).json(result.actualDate))
    .catch(console.log);
});

router.post("/init-game", (req, res, next) => {
  const gameId = req.headers["game-id"] as string;
  gameService
    .initGame(gameId)
    .then(() => res.status(200).json("OK"))
    .catch(console.log);
});

router.post("/:userId", (req, res, next) => {
  gameService
    .createWithUser(req.body, undefined, req.params.userId)
    .then((game) => res.status(200).json(game))
    .catch(console.log);
});

export default router;
