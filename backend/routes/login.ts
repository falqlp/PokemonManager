import express from "express";
const router = express.Router();
import User from "../models/user";

router.post("/", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user?.password === req.body.password) {
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
