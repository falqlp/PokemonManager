const mongoose = require("mongoose");
const PokemonStats = require("../../models/PokemonModels/pokemonStats");

const pokemonSchema = new mongoose.Schema({
  trainerId: { type: String, required: false },
  nickname: { type: String, required: false },
  basePokemon: { type: mongoose.Schema.Types.ObjectId, ref: "PokemonBase" },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  expMax: { type: Number, required: true },
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Move" }],
  stats: { type: PokemonStats.schema, required: true },
  ev: { type: PokemonStats.schema, required: true },
  iv: { type: PokemonStats.schema, required: true },
});

module.exports = mongoose.model("Pokemon", pokemonSchema);
