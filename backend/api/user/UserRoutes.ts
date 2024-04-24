import express from "express";
import CompleteRouter from "../CompleteRouter";
import UserRepository from "../../domain/user/UserRepository";
import UserMapper from "./UserMapper";
import { container } from "tsyringe";

const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(UserRepository),
  container.resolve(UserMapper),
);

router.use("/", completeRouter.router);

export default router;
