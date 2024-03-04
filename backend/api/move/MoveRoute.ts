import express, { Router } from "express";
import MoveService from "./MoveService";
import Move from "./Move";
import MoveMapper from "./MoveMapper";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  new MoveService(Move, MoveMapper)
);

router.use("/", readOnlyRouter.router);

export default router;
