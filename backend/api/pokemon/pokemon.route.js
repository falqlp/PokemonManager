const express = require("express");
const router = express.Router();
const pokemonService = require("./pokemon.service");

router.get("/:id", (req, res, next) => {
  pokemonService
    .get(req.params.id)
    .then((pokemon) => {
      res.status(200).json(pokemon);
    })
    .catch((error) => console.log(error));
});

router.post("/", (req, res, next) => {
  pokemonService
    .create(req.body)
    .then((pokemon) => res.status(200).json(pokemon))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to create Pokemon." });
    });
});

module.exports = router;
