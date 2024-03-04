import express from "express";
import BattleService from "./BattleInstanceService";
import CompleteRouter from "../CompleteRouter";
import Battle from "./Battle";
import BattleInstanceMapper from "./BattleInstanceMapper";
import TrainerService from "../trainer/TrainerService";
import BattleInstanceService from "./BattleInstanceService";

const router = express.Router();
const completeRouter = new CompleteRouter(BattleInstanceService.getInstance());

router.use("/", completeRouter.router);

export default router;
