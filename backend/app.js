const express = require("express");
const app = express();
const mongoose = require("mongoose");
const pokemonBaseRoutes = require("./api/pokemonBase/pokemonBase.route");
const pokemonRoutes = require("./api/pokemon/pokemon.route");
const trainerRoutes = require("./api/trainer/trainer.route");
const bodyParser = require("body-parser");
const loginRoutes = require("./routes/login");
const moveRoute = require("./api/move/move.route");
const migrationService = require("./migration.service");
const i18nService = require("./i18n.service");
const battleRoute = require("./api/battle/battle.route");
const moveLearningRoutes = require("./api/moveLearning/moveLearning.routes");

const mongoURI = "mongodb://127.0.0.1:27017/PokemonManager";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection error to MongoDB", error);
  });

// migrationService.updatePokemonName();
i18nService.checkAndSortLanguageFiles();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/pokemonBase", pokemonBaseRoutes);
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/move", moveRoute);
app.use("/api/battle", battleRoute);
app.use("/api/moveLearning", moveLearningRoutes);

module.exports = app;
