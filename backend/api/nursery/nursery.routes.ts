import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryService from "./nursery.service";

const router = express.Router();
const completeRouter = new CompleteRouter(NurseryService.getInstance());

router.use("/", completeRouter.router);

export default router;
