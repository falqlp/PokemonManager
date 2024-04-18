import express from "express";
import CompleteRouter from "../CompleteRouter";
import BattleInstanceService from "./BattleInstanceService";

const router = express.Router();
const completeRouter = new CompleteRouter(BattleInstanceService.getInstance());

router.use("/", completeRouter.router);

export default router;
