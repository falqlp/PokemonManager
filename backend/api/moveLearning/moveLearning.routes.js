const router = require("express").Router();
const moveLearningService = require("./moveLearning.service");

router.put("/learnableMoves", (req, res, next) => {
  moveLearningService
    .learnableMoves(req.body)
    .then((moves) =>
      res.status(200).json(moves.filter((move) => move.power > 0))
    )
    .catch((error) => console.log(error));
});

module.exports = router;
