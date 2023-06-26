const express = require("express");
const router = express.Router();
const Pokemon = require("../../models/PokemonModels/pokemon");
const pokemonService = require("./pokemonService");

router.get("/", (req, res, next) => {
  Pokemon.find()
    .sort({ id: 1 })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res, next) => {
  Pokemon.findOne({ _id: req.params.id })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.post("/", (req, res, next) => {
  const newPokemon = new Pokemon({ ...pokemonService.createPokemon(req.body) });
  newPokemon
    .save()
    .then((pokemon) => res.status(200).json(pokemon))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to create Pokemon." });
    });
});

module.exports = router;
