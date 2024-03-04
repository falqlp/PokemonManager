import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryService from "./NurseryService";

const router = express.Router();
const service = NurseryService.getInstance();
const completeRouter = new CompleteRouter(service);

router.use("/", completeRouter.router);

export default router;
