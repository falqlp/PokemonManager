const express = require("express");
const router = express.Router();
const PokemonBase = require("../../models/PokemonModels/pokemonBase");

router.get("/", (req, res, next) => {
  PokemonBase.find()
    .sort({ id: 1 })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.get("/search/:name", (req, res, next) => {
  if (req.params.name) {
    const regex = new RegExp("^" + req.params.name, "i");
    PokemonBase.find({ name: regex })
      .sort({ id: 1 })
      .limit(5)
      .then((pokemons) => res.status(200).json(pokemons))
      .catch((error) => console.log(error));
  } else {
    res.status(200).json([]);
  }
});

router.get("/:id", (req, res, next) => {
  PokemonBase.find()
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

module.exports = router;
