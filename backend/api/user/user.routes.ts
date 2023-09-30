import express from "express";
import CompleteRouter from "../CompleteRouter";
import UserService from "./user.service";

const router = express.Router();
const completeRouter = new CompleteRouter(UserService.getInstance());

router.use("/", completeRouter.router);

export default router;
