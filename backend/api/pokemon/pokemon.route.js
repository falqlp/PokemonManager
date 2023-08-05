const express = require("express");
const router = express.Router();
const pokemonService = require("./pokemon.service");
const CompleteRouter = require("../CompleteRouter");
const completeRouter = new CompleteRouter(pokemonService);

router.use("/", completeRouter.router);

module.exports = router;
