import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryRepository from "../../domain/nursery/NurseryRepository";

const router = express.Router();
const service = NurseryRepository.getInstance();
const completeRouter = new CompleteRouter(service);

router.use("/", completeRouter.router);

export default router;
