const express = require("express");
const app = express();
const mongoose = require("mongoose");
const pokemonBaseRoutes = require("./routes/pokemon/pokemonBaseRoute");
const pokemonRoutes = require("./routes/pokemon/pokemonRoute");
const trainerRoutes = require("./routes/trainerRoute");
const bodyParser = require("body-parser");
const loginRoutes = require("./routes/login");
const attackRoute = require("./routes/attackRoute");
const Attack = require("./models/attack");

const mongoURI = "mongodb://127.0.0.1:27017/PokemonManager";

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log("Connecté à MongoDB");
  })
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB", error);
  });

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
app.use("/api/attack", attackRoute);

module.exports = app;
