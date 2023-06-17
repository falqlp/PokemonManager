const mongoose = require('mongoose');

const pokemonSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  firstType: { type: String, required: true },
  secondType: { type: String, required: false },
});

module.exports = mongoose.model('Pokemon', pokemonSchema);