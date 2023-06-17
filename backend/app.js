const express = require('express');
const app = express();
const Pokemon = require('./models/pokemon');
const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/PokemonManager';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB', error);
  });

  const pikachu = new Pokemon({
    name:'pikachu',
    firstType:'elec',
  });
  Pokemon.find().then((res)=>console.log(res))

module.exports = app;
