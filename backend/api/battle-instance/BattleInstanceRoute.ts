import express from "express";
import CompleteRouter from "../CompleteRouter";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import BattleInstanceMapper from "./BattleInstanceMapper";

const router = express.Router();
const completeRouter = new CompleteRouter(
  BattleInstanceRepository.getInstance(),
  BattleInstanceMapper.getInstance(),
);

router.use("/", completeRouter.router);

export default router;
