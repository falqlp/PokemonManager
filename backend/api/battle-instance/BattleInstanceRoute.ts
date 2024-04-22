import express from "express";
import CompleteRouter from "../CompleteRouter";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";

const router = express.Router();
const completeRouter = new CompleteRouter(
  BattleInstanceRepository.getInstance(),
);

router.use("/", completeRouter.router);

export default router;
