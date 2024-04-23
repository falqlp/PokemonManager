import express from "express";
import CompleteRouter from "../CompleteRouter";
import UserRepository from "../../domain/user/UserRepository";

const router = express.Router();
const completeRouter = new CompleteRouter(UserRepository.getInstance());

router.use("/", completeRouter.router);

export default router;
