import express from "express";
import UserRepository from "../../domain/user/UserRepository";
import UserMapper from "./UserMapper";
import { container } from "tsyringe";
import { UserService } from "../../application/user/UserService";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router = express.Router();
const service = container.resolve(UserService);
const repository = container.resolve(UserRepository);

const readOnlyRouter = new ReadOnlyRouter(
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
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/change-language", async (req, res, next) => {
  try {
    await service.changeLanguage(req.body.userId, req.body.lang);
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/verify", async (req, res, next) => {
  try {
    await service.verifyMail(req.body.userId);
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/accept-friend-request", async (req, res, next) => {
  try {
    await service.acceptFriendRequest(req.body.userId, req.body.friendId);
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/delete-friend-request", async (req, res, next) => {
  try {
    await service.deleteFriendRequest(req.body.userId, req.body.friendId);
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/change-password", async (req, res, next) => {
  try {
    await service.changePassword(req.body.password, req.body.passwordRequestId);
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/read-news", async (req, res, next) => {
  try {
    await service.readNews(req.body.userId);
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/is-email-used", async (req, res, next) => {
  try {
    const obj = await repository.list({ custom: { email: req.body.email } });
    res.status(200).json(obj.length > 0);
  } catch (error: unknown) {
    next(error);
  }
});

router.put("/is-username-used", async (req, res, next) => {
  try {
    const obj = await repository.list({
      custom: { username: req.body.username },
    });
    res.status(200).json(obj.length > 0);
  } catch (error: unknown) {
    next(error);
  }
});

router.use("/", readOnlyRouter.router);

export default router;
