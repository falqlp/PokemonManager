const express = require("express");
const router = express.Router();
const battleService = require("./battle.service");

router.post("/", (req, res, next) => {
  battleService
    .create(req.body)
    .then((battle) => res.status(200).json(battle))
    .catch((error) => console.log(error));
});

router.put("/:id", (req, res, next) => {
  battleService
    .update(req.params.id, req.body)
    .then((battle) => res.status(200).json(battle))
    .catch((error) => console.log(error));
});

router.get("/:id", (req, res, next) => {
  battleService
    .get(req.params.id)
    .then((battle) => res.status(200).json(battle))
    .catch((error) => console.log(error));
});

module.exports = router;
