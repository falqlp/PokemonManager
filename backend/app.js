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

const axios = require("axios");
const attack = require("./models/attack");

for (let i = 1000; i < 1000; i++) {
  axios
    .get("https://pokeapi.co/api/v2/move/" + (i + 1))
    .then((response) => {
      let name;
      response.data.names.forEach((element) => {
        if (element.language.name === "fr") {
          name = element.name;
        }
      });
      if (name === undefined) {
        response.data.names.forEach((element) => {
          if (element.language.name === "en") {
            name = element.name;
          }
        });
      }
      console.log(
        i,
        name,
        typeEnToFr(response.data.type.name),
        response.data.damage_class.name,
        response.data.accuracy,
        response.data.power
      );
      let attackData = {
        id: i,
        name: name,
        type: typeEnToFr(response.data.type.name),
        category: response.data.damage_class.name,
        accuracy: response.data.accuracy,
        power: response.data.power,
      };

      Attack.findOneAndUpdate({ name: attackData.name }, attackData, {
        upsert: true,
        new: true,
        runValidators: true,
      })
        .then((doc) => {
          console.log(doc);
        })
        .catch((err) => {
          console.log("Something went wrong when updating the data!", err);
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
function typeEnToFr(type) {
  switch (type) {
    case "normal":
      return "Normal";
    case "fire":
      return "Feu";
    case "water":
      return "Eau";
    case "electric":
      return "Électrik";
    case "grass":
      return "Plante";
    case "ice":
      return "Glace";
    case "fighting":
      return "Combat";
    case "poison":
      return "Poison";
    case "ground":
      return "Sol";
    case "flying":
      return "Vol";
    case "psychic":
      return "Psy";
    case "bug":
      return "Insecte";
    case "rock":
      return "Roche";
    case "ghost":
      return "Spectre";
    case "dragon":
      return "Dragon";
    case "dark":
      return "Ténèbres";
    case "steel":
      return "Acier";
    case "fairy":
      return "Fée";
    default:
      return type;
  }
}

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
