import express from "express";
import CompleteRouter from "../CompleteRouter";
import GameService from "./game.service";
const service = GameService.getInstance();

const router = express.Router();
const completeRouter = new CompleteRouter(service);

router.use("/", completeRouter.router);

router.get("/player/:id", (req, res, next) => {
  service
    .get(req.params.id)
    .then((result) => res.status(200).json(result.player))
    .catch(console.log);
});

router.get("/time/:id", (req, res, next) => {
  service
    .get(req.params.id)
    .then((result) => res.status(200).json(result.actualDate))
    .catch(console.log);
});

export default router;
