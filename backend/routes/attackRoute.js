const express = require("express");
const router = express.Router();
const Attack = require("../models/attack");

router.post("/", (req, res, next) => {
  const attackNames = req.body;
  Attack.find({ name: { $in: attackNames } })
    .then((attacks) => res.status(200).json(attacks))
    .catch((error) => console.log(error));
});

module.exports = router;
