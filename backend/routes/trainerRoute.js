const express = require("express");
const router = express.Router();
const Trainer = require("../models/TrainerModels/trainer");

router.get("/", (req, res, next) => {
  Trainer.find()
    .sort({ id: 1 })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.get("/search/:name", (req, res, next) => {
  if (req.params.name) {
    const regex = new RegExp("^" + req.params.name, "i");
    Trainer.find({ name: regex })
      .sort({ id: 1 })
      .limit(5)
      .then((pokemons) => res.status(200).json(pokemons))
      .catch((error) => console.log(error));
  } else {
    res.status(200).json([]);
  }
});

router.get("/:id", (req, res, next) => {
  Trainer.findOne({ _id: req.params.id })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

module.exports = router;
