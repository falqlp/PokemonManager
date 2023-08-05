const mongoose = require("mongoose");
const PokemonStats = require("../../models/PokemonModels/pokemonStats");

const pokemonBaseSchema = mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  types: [{ type: String }],
  baseStats: { type: PokemonStats.schema, required: true },
});

module.exports = mongoose.model("PokemonBase", pokemonBaseSchema);
