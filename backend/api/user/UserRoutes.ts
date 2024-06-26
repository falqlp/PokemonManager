import express from "express";
import CompleteRouter from "../CompleteRouter";
import UserRepository from "../../domain/user/UserRepository";
import UserMapper from "./UserMapper";
import { container } from "tsyringe";
import { UserService } from "../../application/user/UserService";

const router = express.Router();
const service = container.resolve(UserService);
const repository = container.resolve(UserRepository);

const completeRouter = new CompleteRouter(
  repository,
  container.resolve(UserMapper),
);

router.post("/", async (req, res, next) => {
  try {
    const obj = await service.create(req.body);
    res.status(200).json(obj);
  } catch (error: any) {
    if (error.message === "Bad email") {
      res.status(400).json({ message: "EMAIL_ALREADY_USED" });
    } else {
      next(error);
    }
  }
});

router.put("/add-friend", async (req, res, next) => {
  try {
    await service.addFriend(req.body.userId, req.body.friendId);
    res.status(200).json();
  } catch (error: any) {
    next(error);
  }
});

router.put("/is-email-used", async (req, res, next) => {
  try {
    const obj = await repository.list({ custom: { email: req.body.email } });
    res.status(200).json(obj.length > 0);
  } catch (error: any) {
    next(error);
  }
});

router.put("/is-username-used", async (req, res, next) => {
  try {
    const obj = await repository.list({
      custom: { username: req.body.username },
    });
    res.status(200).json(obj.length > 0);
  } catch (error: any) {
    next(error);
  }
});

router.use("/", completeRouter.router);

export default router;
