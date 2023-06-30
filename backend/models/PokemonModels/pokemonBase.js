const mongoose = require("mongoose");
const PokemonStats = require("./pokemonStats");

const pokemonBaseSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  types: [{ type: String }],
  baseStats: { type: PokemonStats.schema, required: true },
});

module.exports = mongoose.model("PokemonBase", pokemonBaseSchema);
