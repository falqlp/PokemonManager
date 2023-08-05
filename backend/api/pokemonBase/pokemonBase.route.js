const express = require("express");
const router = express.Router();
const PokemonBase = require("./pokemonBase");
const pokemonBaseService = require("./pokemonBase.service");
const ReadOnlyRouter = require("../ReadOnlyRouter");
const readOnlyRouter = new ReadOnlyRouter(pokemonBaseService);

router.use("/", readOnlyRouter.router);
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

module.exports = router;
