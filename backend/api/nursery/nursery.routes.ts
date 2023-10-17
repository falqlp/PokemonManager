import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryService from "./nursery.service";

const router = express.Router();
const service = NurseryService.getInstance();
const completeRouter = new CompleteRouter(service);

router.use("/", completeRouter.router);

export default router;
