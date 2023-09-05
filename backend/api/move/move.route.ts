import express, { Router } from "express";
import moveService from "./move.service";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyRouter(moveService);

router.use("/", readOnlyRouter.router);

export default router;
