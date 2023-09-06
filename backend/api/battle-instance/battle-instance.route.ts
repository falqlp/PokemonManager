import express from "express";
import battleService from "./battle-instance.service";
import CompleteRouter from "../CompleteRouter";

const router = express.Router();
const completeRouter = new CompleteRouter(battleService);

router.use("/", completeRouter.router);

export default router;
