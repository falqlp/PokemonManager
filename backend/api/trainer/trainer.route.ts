import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainerService from "./trainer.service";

const router = express.Router();
const completeRouter = new CompleteRouter(TrainerService.getInstance());

router.use("/", completeRouter.router);

export default router;
