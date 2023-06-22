const mongoose = require("mongoose");

const pokemonSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  types: [{ type: String }],
  hp: { type: Number, required: true },
  atk: { type: Number, required: true },
  def: { type: Number, required: true },
  spAtk: { type: Number, required: true },
  spDef: { type: Number, required: true },
  spe: { type: Number, required: true },
});

module.exports = mongoose.model("Pokemon", pokemonSchema);
