const mongoose = require("mongoose");

const evolutionSchema = new mongoose.Schema({
  evolutionMethod: { type: String, require: true },
  minLevel: { type: Number },
  pokemonId: { type: Number, require: true },
  evolveTo: { type: Number, require: true },
});

module.exports = mongoose.model("Evolution", evolutionSchema);
