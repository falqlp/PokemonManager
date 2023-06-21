const express = require("express");
const app = express();
const Pokemon = require("./models/pokemon");
const PokemonBase = require("./models/pokemonBase");
const mongoose = require("mongoose");
const { error } = require("console");

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

Pokemon.find()
  .then((pokemons) => {
    console.log(pokemons);
    pokemons.forEach((pokemon) => {
      let newPokemon = new PokemonBase({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        baseStats: {
          hp: pokemon.hp,
          atk: pokemon.atk,
          def: pokemon.def,
          spAtk: pokemon.spAtk,
          spDef: pokemon.spDef,
          spe: pokemon.spe,
        },
      });
      newPokemon.save().then(console.log("ok"));
    });
  })
  .catch((error) => console.log(error));

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
    .then((pokemons) => res.status(200).json(pokemons))
    .catch((error) => console.log(error));
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
