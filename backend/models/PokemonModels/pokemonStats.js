const mongoose = require("mongoose");

const pokemonStatsSchema = mongoose.Schema({
  hp: { type: Number, required: true },
  atk: { type: Number, required: true },
  def: { type: Number, required: true },
  spAtk: { type: Number, required: true },
  spDef: { type: Number, required: true },
  spe: { type: Number, required: true },
});

module.exports = mongoose.model("PokemonStats", pokemonStatsSchema);
