const express = require("express");
const router = express.Router();
const pcStorageService = require("./pcStorage.service");
const CompleteRouter = require("../CompleteRouter");
const completeRouter = new CompleteRouter(pcStorageService);

router.use("/", completeRouter.router);

module.exports = router;
