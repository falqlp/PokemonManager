import express from "express";
import CompleteRouter from "../CompleteRouter";
import UserRepository from "../../domain/user/UserRepository";
import UserMapper from "./UserMapper";

const router = express.Router();
const completeRouter = new CompleteRouter(
  UserRepository.getInstance(),
  UserMapper.getInstance(),
);

router.use("/", completeRouter.router);

export default router;
