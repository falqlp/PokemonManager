import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryService from "./nursery.service";

const router = express.Router();
const service = NurseryService.getInstance();
const completeRouter = new CompleteRouter(service);

router.use("/", completeRouter.router);

router.post("/generateNurseryEggs", (req, res, next) => {
  const gameId = req.headers["game-id"] as string;
  service
    .generateNurseryEgg(req.body, gameId)
    .then((result) => res.status(200).json(result))
    .catch(console.log);
});

export default router;
