const express = require("express");
const router = express.Router();
const Trainer = require("../models/TrainerModels/trainer");

router.get("/", (req, res, next) => {
  Trainer.find()
    .sort({ id: 1 })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res, next) => {
  Trainer.findOne({ _id: req.params.id })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.put("/:id", (req, res, next) => {
  Trainer.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "Trainer updated successfully!" })
    )
    .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
