const express = require("express");
const app = express();
const mongoose = require("mongoose");
const pokemonBaseRoutes = require("./routes/pokemon/pokemonBase.route");
const pokemonRoutes = require("./routes/pokemon/pokemon.route");
const trainerRoutes = require("./routes/trainer.route");
const bodyParser = require("body-parser");
const loginRoutes = require("./routes/login");
const moveRoute = require("./routes/move.route");
const migrationService = require("./migration.service");
const i18nService = require("./i18n.service");
const battleRoute = require("./routes/battle.route");

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

// migrationService.getEvolution();
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

module.exports = app;
