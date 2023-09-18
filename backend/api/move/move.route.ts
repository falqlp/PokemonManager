import express, { Router } from "express";
import MoveService from "./move.service";
import Move from "./move";
import MoveMapper from "./move.mapper";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  new MoveService(Move, MoveMapper)
);

router.use("/", readOnlyRouter.router);

export default router;
