import express from "express";
import BattleService from "./battle-instance.service";
import CompleteRouter from "../CompleteRouter";
import Battle from "./battle";
import BattleInstanceMapper from "./battle-instance.mapper";
import TrainerService from "../trainer/trainer.service";
import BattleInstanceService from "./battle-instance.service";

const router = express.Router();
const completeRouter = new CompleteRouter(BattleInstanceService.getInstance());

router.use("/", completeRouter.router);

export default router;
