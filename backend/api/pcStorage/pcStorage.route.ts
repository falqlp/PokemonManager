import express from "express";
import pcStorageService from "./pcStorage.service";
import CompleteRouter from "../CompleteRouter";
import PcStorageService from "./pcStorage.service";

const router = express.Router();
const completeRouter = new CompleteRouter(PcStorageService.getInstance());

router.use("/", completeRouter.router);

export default router;
