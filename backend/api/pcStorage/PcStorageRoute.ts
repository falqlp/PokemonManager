import express from "express";
import PcStorageService from "../../domain/trainer/pcStorage/PcStorageRepository";
import PcStorageMapper from "./PcStorageMapper";
import { container } from "tsyringe";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router = express.Router();
const readOnlyRouter = new ReadOnlyRouter(
  container.resolve(PcStorageService),
  container.resolve(PcStorageMapper),
);

router.use("/", readOnlyRouter.router);

export default router;
