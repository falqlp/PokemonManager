import express, { Router } from "express";
import MoveRepository from "../../domain/move/MoveRepository";
import Move from "../../domain/move/Move";
import MoveMapper from "../../domain/move/MoveMapper";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  new MoveRepository(Move, MoveMapper),
);

router.use("/", readOnlyRouter.router);

export default router;
