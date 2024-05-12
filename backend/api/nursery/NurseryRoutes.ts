import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryRepository from "../../domain/trainer/nursery/NurseryRepository";
import NurseryMapper from "./NurseryMapper";
import { container } from "tsyringe";

const router = express.Router();
const service = container.resolve(NurseryRepository);
const completeRouter = new CompleteRouter(
  service,
  container.resolve(NurseryMapper),
);

router.use("/", completeRouter.router);

export default router;
