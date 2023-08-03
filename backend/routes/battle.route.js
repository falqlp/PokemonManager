const express = require("express");
const router = express.Router();
const Battle = require("../models/battle");

router.post("/", (req, res, next) => {
  const newBattle = new Battle({
    ...req.body,
    player: req.body.playerId,
    opponent: req.body.opponentId,
  });
  newBattle
    .save()
    .then((battle) => res.status(200).json(battle))
    .catch((error) => console.log(error));
});

router.post("/:id", (req, res, next) => {
  Battle.updateOne({_id: req.params.id}, {...req.body, _id: req.params._id}).then((battle) => res.status(200).json(battle)).catch((error)=>console.log(error));
});

router.get("/:id", (req, res, next) => {
  Battle.findOne({ _id: req.params.id })
    .populate({
      path: "player",
      populate: {
        path: "pokemons",
        populate: {
          path: "attacks",
        },
      },
    })
    .populate({
      path: "opponent",
      populate: {
        path: "pokemons",
        populate: {
          path: "attacks",
        },
      },
    })
    .then((battle) =>
      res.status(200).json(battle)
    )
    .catch((error) => console.log(error));
});

module.exports = router;
