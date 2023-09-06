import express from "express";
import trainerService from "./trainer.service";
import CompleteRouter from "../CompleteRouter";

const router = express.Router();
const completeRouter = new CompleteRouter(trainerService);

router.use("/", completeRouter.router);

export default router;
