import express from "express";
import { container } from "tsyringe";
import CompetitionRepository from "../../domain/competiton/CompetitionRepository";
import CompetitionMapper from "./CompetitionMapper";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router = express.Router();
const mapper = container.resolve(CompetitionMapper);
const completeRouter = new ReadOnlyRouter(
  container.resolve(CompetitionRepository),
  mapper,
);

router.use("/", completeRouter.router);

export default router;
