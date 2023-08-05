const express = require("express");
const router = express.Router();
const Move = require("./move");

router.post("/", (req, res, next) => {
  const moveNames = req.body;
  Move.find({ name: { $in: moveNames } })
    .then((moves) => res.status(200).json(moves))
    .catch((error) => console.log(error));
});

module.exports = router;
