const express = require("express");
const app = express();
const Pokemon = require("./models/pokemon");
const PokemonBase = require("./models/pokemonBase");
const mongoose = require("mongoose");
const { error } = require("console");
const pokemon = require("./models/pokemon");

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
app.get("/api/pokemonBase", (req, res, next) => {
  PokemonBase.find()
    .sort({ id: 1 })
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

app.get("/api/pokemonBase/search/:name", (req, res, next) => {
  if (req.params.name) {
    const regex = new RegExp("^" + req.params.name, "i");
    PokemonBase.find({ name: regex })
      .sort({ id: 1 })
      .limit(5)
      .then((pokemons) => res.status(200).json(pokemons))
      .catch((error) => console.log(error));
  } else {
    res.status(200).json([]);
  }
});

app.get("/api/pokemonBase/:id", (req, res, next) => {
  PokemonBase.find()
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
});

// const bulbizarre = new Pokemon({
//   id:1,
//   name:'bulbizarre',
//   types:['plante', 'poison'],
// });
// bulbizarre.save().then(()=>console.log('save')).catch((error)=>console.log('error: ', error));
// Pokemon.find().then((res)=>console.log(res));
// Pokemon.findOne({id:25}).then((res)=>console.log(res))

module.exports = app;
