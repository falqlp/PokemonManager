import express from "express";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";
import { container } from "tsyringe";
import CompetitionHistoryRepository from "../../domain/competiton/competitionHistory/CompetitionHistoryRepository";
import CompetitionHistoryMapper from "./CompetitionHistoryMapper";

const router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  container.resolve(CompetitionHistoryRepository),
  CompetitionHistoryMapper,
);
router.use("/", readOnlyRouter.router);

export default router;
