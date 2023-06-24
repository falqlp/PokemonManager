const mongoose = require("mongoose");
const PokemonStats = require("./pokemonStats");

const pokemonBaseSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  types: [{ type: String }],
  baseStats: { type: PokemonStats.schema, required: true },
});

module.exports = mongoose.model("PokemonBase", pokemonBaseSchema);
