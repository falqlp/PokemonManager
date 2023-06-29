const mongoose = require("mongoose");
const PokemonBase = require("./pokemonBase");
const PokemonStats = require("./pokemonStats");

const pokemonSchema = new mongoose.Schema({
  trainerId: { type: String, required: false },
  nickname: { type: String, required: false },
  basePokemon: { type: PokemonBase.schema, required: true },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  expMax: { type: Number, required: true },
  attacks: [{ type: String, required: false }],
  stats: { type: PokemonStats.schema, required: true },
  ev: { type: PokemonStats.schema, required: true },
  iv: { type: PokemonStats.schema, required: true },
});

module.exports = mongoose.model("Pokemon", pokemonSchema);
