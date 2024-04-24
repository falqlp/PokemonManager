import express, { Router } from "express";
import MoveRepository from "../../domain/move/MoveRepository";
import MoveMapper from "./MoveMapper";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  MoveRepository.getInstance(),
  MoveMapper,
);

router.use("/", readOnlyRouter.router);

export default router;
