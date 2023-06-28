const express = require("express");
const router = express.Router();
const Trainer = require("../models/TrainerModels/trainer");
const Pokemon = require("../models/PokemonModels/pokemon");

router.get("/", (req, res, next) => {
  Trainer.find()
    .sort({ id: 1 })
    .then((trainers) => res.status(200).json(trainers))
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res, next) => {
  Trainer.findOne({ _id: req.params.id })
    .then((trainer) => res.status(200).json(trainer))
    .catch((error) => console.log(error));
});

router.get("/pokemons/:id", (req, res, next) => {
  Trainer.findOne({ _id: req.params.id })
    .then((trainer) => {
      Pokemon.find({
        _id: { $in: trainer.pokemons },
      })
        .then((pokemons) => {
          res.status(200).json(pokemons);
        })
        .catch((error) => console.log(error));
    })
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
