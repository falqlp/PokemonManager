import express from "express";
import pcStorageService from "./pcStorage.service";
import CompleteRouter from "../CompleteRouter";

const router = express.Router();
const completeRouter = new CompleteRouter(pcStorageService);

router.use("/", completeRouter.router);

export default router;
