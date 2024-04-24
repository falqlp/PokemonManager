import express from "express";
import CompleteRouter from "../CompleteRouter";
import PcStorageService from "../../domain/pcStorage/PcStorageRepository";
import PcStorageMapper from "./PcStorageMapper";
import { container } from "tsyringe";

const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(PcStorageService),
  container.resolve(PcStorageMapper),
);

router.use("/", completeRouter.router);

export default router;
