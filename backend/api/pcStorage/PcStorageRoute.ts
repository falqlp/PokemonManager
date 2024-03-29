import express from "express";
import pcStorageService from "./PcStorageService";
import CompleteRouter from "../CompleteRouter";
import PcStorageService from "./PcStorageService";

const router = express.Router();
const completeRouter = new CompleteRouter(PcStorageService.getInstance());

router.use("/", completeRouter.router);

export default router;
