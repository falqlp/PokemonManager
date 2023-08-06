const router = require("express").Router();
const moveLearningService = require("./moveLearning.service");

router.put("/learnableMoves", (req, res, next) => {
  moveLearningService
    .learnableMoves(req.body)
    .then((moves) => res.status(200).json(moves))
    .catch((error) => console.log(error));
});

module.exports = router;
