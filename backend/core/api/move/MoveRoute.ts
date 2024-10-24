import express, { Router } from "express";
import MoveRepository from "../../domain/move/MoveRepository";
import MoveMapper from "./MoveMapper";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";
import { container } from "tsyringe";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  container.resolve(MoveRepository),
  MoveMapper,
);

router.use("/", readOnlyRouter.router);

export default router;
