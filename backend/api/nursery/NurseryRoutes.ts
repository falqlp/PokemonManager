import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryRepository from "../../domain/nursery/NurseryRepository";
import NurseryMapper from "./NurseryMapper";

const router = express.Router();
const service = NurseryRepository.getInstance();
const completeRouter = new CompleteRouter(service, NurseryMapper.getInstance());

router.use("/", completeRouter.router);

export default router;
