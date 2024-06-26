import express from "express";
import { container } from "tsyringe";
import { PasswordRequestService } from "../../application/user/passwordRequest/PasswordRequestService";
import { PasswordRequestRepository } from "../../domain/user/passwordRequest/PasswordRequestRepository";
import UserMapper from "../user/UserMapper";

const router = express.Router();
const service = container.resolve(PasswordRequestService);
const repository = container.resolve(PasswordRequestRepository);
const userMapper = container.resolve(UserMapper);

router.post("/", async (req, res, next) => {
  try {
    const lang = req.headers["lang"] as string;
    await service.createPasswordRequest(
      req.body.username,
      req.body.email,
      lang,
    );
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const obj = await repository.get(req.params.id);
    obj.user = userMapper.map(obj.user);
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
});

export default router;
