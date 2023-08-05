const express = require("express");
const router = express.Router();
const trainerService = require("./trainer.service");
const CompleteRouter = require("../CompleteRouter");
const completeRouter = new CompleteRouter(trainerService);

router.use("/", completeRouter.router);

module.exports = router;
