const express = require("express");
const router = express.Router();
const battleService = require("./battle-instance.service");
const CompleteRouter = require("../CompleteRouter");
const completeRouter = new CompleteRouter(battleService);

router.use("/", completeRouter.router);

module.exports = router;
