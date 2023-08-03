const express = require("express");
const router = express.Router();
const Pokemon = require("../../models/PokemonModels/pokemon");
const pokemonService = require("./pokemon.service");

router.get("/", (req, res, next) => {
  Pokemon.find()
    .populate("moves")
    .sort({ id: 1 })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res, next) => {
  Pokemon.findOne({ _id: req.params.id })
    .populate("moves")
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

router.post("/", (req, res, next) => {
  const pokemonData = pokemonService.createPokemon(req.body);
  const newPokemon = new Pokemon({
    ...pokemonData,
    moves: pokemonData.moves?.map((move) => move._id),
  });

  newPokemon
    .save()
    .then((pokemon) => res.status(200).json(pokemon))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to create Pokemon." });
    });
});

module.exports = router;
