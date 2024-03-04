import express from "express";
import CompleteRouter from "../CompleteRouter";
import TrainingCampService from "./TrainingCampService";

const router = express.Router();
const completeRouter = new CompleteRouter(TrainingCampService.getInstance());

router.use("/", completeRouter.router);

export default router;
