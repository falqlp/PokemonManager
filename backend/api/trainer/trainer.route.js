const express = require("express");
const router = express.Router();
const trainerService = require("./trainer.service");

router.get("/:id", (req, res, next) => {
  trainerService
    .get(req.params.id)
    .then((trainer) => {
      res.status(200).json(trainer);
    })
    .catch((error) => console.log(error));
});

router.put("/:id", (req, res, next) => {
  trainerService
    .update(req.params.id, req.body)
    .then((trainer) =>
      res.status(200).json({ message: "Trainer updated successfully!" })
    )
    .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
