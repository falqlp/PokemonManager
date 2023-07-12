const express = require("express");
const app = express();
const mongoose = require("mongoose");
const pokemonBaseRoutes = require("./routes/pokemon/pokemonBaseRoute");
const pokemonRoutes = require("./routes/pokemon/pokemonRoute");
const trainerRoutes = require("./routes/trainerRoute");
const bodyParser = require("body-parser");
const loginRoutes = require("./routes/login");
const attackRoute = require("./routes/attackRoute");
const migrationService = require("./migration.service");
const fs = require("fs");
const path = require("path");

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

// migrationService.updatePokemonName();

const dirPath = "../frontend/src/assets/i18n";
const files = fs.readdirSync(dirPath);

files.forEach((file) => {
  const filePath = path.join(dirPath, file);
  const obj = JSON.parse(fs.readFileSync(filePath, "utf8"));

  let sortedArray = Object.keys(obj)
    .sort()
    .map((key) => {
      return [key, obj[key]];
    });

  let newObj = {};
  for (let i = 0; i < sortedArray.length; i++) {
    newObj[sortedArray[i][0]] = sortedArray[i][1];
  }

  const newData = JSON.stringify(newObj, null, 2);
  fs.writeFileSync(filePath, newData, "utf8");
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
