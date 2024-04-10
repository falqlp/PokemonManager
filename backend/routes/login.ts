import express from "express";
import User from "../api/user/User";
import HashService from "../application/hash/HashService";
const router = express.Router();
const hashService = HashService.getInstance();

router.post("/", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(async (user) => {
      if (await hashService.checkPassword(user, req.body.password)) {
        res.status(200).json(user);
      } else {
        res
          .status(400)
          .json({ message: "Password and username does not match" });
      }
    })
    .catch((error) => console.log(error));
});

export default router;
