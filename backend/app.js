const express = require('express');
const app = express();
const Pokemon = require('./models/pokemon');
const mongoose = require('mongoose');
const { error } = require('console');

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
    id:25,
    name:'pikachu',
    types:['elec'],
  });
  // pikachu.save().then(()=>console.log('save')).catch((error)=>console.log('error: ', error));
  // Pokemon.find().then((res)=>console.log(res));
  Pokemon.findOne({id:25}).then((res)=>console.log(res))

module.exports = app;
