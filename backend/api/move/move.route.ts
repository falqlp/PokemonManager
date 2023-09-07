import express, { Router } from "express";
import MoveService from "./move.service";
import ReadOnlyRouter from "../ReadOnlyRouter";
import Move from "./move";
import MoveMapper from "./move.mapper";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyRouter(new MoveService(Move, MoveMapper));

router.use("/", readOnlyRouter.router);

export default router;
