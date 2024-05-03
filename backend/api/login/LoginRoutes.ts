import express from "express";
import HashService from "../../application/hash/HashService";
import { container } from "tsyringe";
import UserRepository from "../../domain/user/UserRepository";
const router = express.Router();
const hashService = container.resolve(HashService);
const userRepository = container.resolve(UserRepository);

router.post("/", async (req, res, next) => {
  try {
    const user = await userRepository.getByUsername(req.body.username);
    if (!user.verified) {
      res.status(400).json({ message: "Email not verified" });
    } else if (await hashService.checkPassword(user, req.body.password)) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Password and username does not match" });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
