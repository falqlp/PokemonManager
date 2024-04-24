import express from "express";
import CompleteRouter from "../CompleteRouter";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import BattleInstanceMapper from "./BattleInstanceMapper";
import { container } from "tsyringe";

const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(BattleInstanceRepository),
  container.resolve(BattleInstanceMapper),
);

router.use("/", completeRouter.router);

export default router;
