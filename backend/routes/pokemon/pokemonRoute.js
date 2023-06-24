const express = require("express");
const router = express.Router();
const Pokemon = require("../../models/PokemonModels/pokemon");

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
  console.log(req.body);
  if (req.body.iv === undefined) {
    req.body.iv = {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      spe: Math.floor(Math.random() * 32),
    };
  }
  console.log(req.body);
  if (!req.body.ev) {
    res.body.ev = {
      hp: 0,
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      spe: 0,
    };
  }
  req.body.stats = {
    hp: calcHp(
      req.body.basePokemon.baseStats.hp,
      req.body.niv,
      req.body.iv.hp,
      req.body.ev.hp
    ),
    atk: calcStat(
      req.body.basePokemon.baseStats.atk,
      req.body.niv,
      req.body.iv.atk,
      req.body.ev.atk
    ),
    def: calcStat(
      req.body.basePokemon.baseStats.def,
      req.body.niv,
      req.body.iv.def,
      req.body.ev.def
    ),
    spAtk: calcStat(
      req.body.basePokemon.baseStats.spAtk,
      req.body.niv,
      req.body.iv.spAtk,
      req.body.ev.spAtk
    ),
    spDef: calcStat(
      req.body.basePokemon.baseStats.spDef,
      req.body.niv,
      req.body.iv.spDef,
      req.body.ev.spDef
    ),
    spe: calcStat(
      req.body.basePokemon.baseStats.spe,
      req.body.niv,
      req.body.iv.spe,
      req.body.ev.spe
    ),
  };
  const newPokemon = new Pokemon();
  newPokemon = req.body;

  newPokemon
    .save()
    .then((pokemon) => res.status(200).json(pokemon))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to create Pokemon." });
    });
});

function calcStat(bs, niv, iv, ev) {
  return Math.floor(((2 * bs + Math.floor(ev / 4) + iv) * niv) / 100) + 5;
}

function calcHp(bs, niv, iv, ev) {
  return (
    Math.floor(((2 * bs + Math.floor(ev / 4) + iv) * niv) / 100) + niv + 10
  );
}

module.exports = router;
