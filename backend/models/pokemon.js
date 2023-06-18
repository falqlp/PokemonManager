const mongoose = require('mongoose');

const pokemonSchema = mongoose.Schema({
  id: {type: Number, required:true, unique:true},
  name: { type: String, required: true, unique: true },
  types: [{ type: String }],
});

module.exports = mongoose.model('Pokemon', pokemonSchema);