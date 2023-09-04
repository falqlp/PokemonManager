const express = require("express");
const router = express.Router();
const battleService = require("./battle.service");
const battleCalcService = require("./battle-calc.service");
const battleAiService = require("./battle-ai.service");

router.post("/calcDamage", (req, res, next) => {
  res
    .status(200)
    .json(
      battleCalcService.moveDamage(
        req.body.attPokemon,
        req.body.defPokemon,
        req.body.move
      )
    );
});

router.post("/decisionMaking", (req, res, next) => {
  const estimator = battleAiService.decisionMaking(
    req.body.opponentPokemon,
    req.body.selectedMove,
    req.body.pokemons
  );
  res.status(200).json(estimator);
});

router.post("/simulateBattleRound", (req, res, next) => {
  const round = battleService.simulateBattleRound(
    req.body.trainer1,
    req.body.trainer2
  );
  res.status(200).json(round);
});

module.exports = router;
