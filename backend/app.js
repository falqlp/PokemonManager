const express = require("express");
const app = express();
const Pokemon = require("./models/PokemonModels/pokemon");
const PokemonBase = require("./models/PokemonModels/pokemonBase");
const Trainer = require("./models/TrainerModels/trainer");
const mongoose = require("mongoose");
const pokemonBaseRoutes = require("./routes/pokemon/pokemonBaseRoute");
const pokemonRoutes = require("./routes/pokemon/pokemonRoute");
const trainerRoutes = require("./routes/trainerRoute");
const bodyParser = require("body-parser");

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

app.use((req, res, next) => {
  bodyParser.json();
  next();
}); // pour analyser les requêtes de type application/json
app.use((req, res, next) => {
  bodyParser.urlencoded({ extended: true });
  next();
}); // pour analyser les requêtes de type application/x-www-form-urlencoded

app.use("/api/pokemonBase", pokemonBaseRoutes);
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/trainer", trainerRoutes);

// const bulbizarre = new Pokemon({
//   id:1,
//   name:'bulbizarre',
//   types:['plante', 'poison'],
// });
// bulbizarre.save().then(()=>console.log('save')).catch((error)=>console.log('error: ', error));
// Pokemon.find().then((res)=>console.log(res));
// Pokemon.findOne({id:25}).then((res)=>console.log(res))

module.exports = app;
