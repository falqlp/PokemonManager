const express = require("express");
const router = express.Router();
const moveService = require("./move.service");
const ReadOnlyRouter = require("../ReadOnlyRouter");
const readOnlyRouter = new ReadOnlyRouter(moveService);

router.use("/", readOnlyRouter.router);

module.exports = router;
