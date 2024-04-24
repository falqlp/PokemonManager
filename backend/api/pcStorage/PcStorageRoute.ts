import express from "express";
import CompleteRouter from "../CompleteRouter";
import PcStorageService from "../../domain/pcStorage/PcStorageRepository";
import PcStorageMapper from "./PcStorageMapper";

const router = express.Router();
const completeRouter = new CompleteRouter(
  PcStorageService.getInstance(),
  PcStorageMapper.getInstance(),
);

router.use("/", completeRouter.router);

export default router;
