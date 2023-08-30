const express = require("express");
const router = express.Router();
const battleService = require("./battle.service");
const battleCalcService = require("./battle-calc.service");

router.post("/calcDamage", (req, res, next) => {
  const damage = battleCalcService.calcDamage(
    req.body.attPokemon,
    req.body.defPokemon,
    req.body.move
  );
  const pokemon = battleCalcService.damageOnPokemon(
    req.body.defPokemon,
    damage
  );
  res.status(200).json({ damage, pokemon });
});

module.exports = router;
