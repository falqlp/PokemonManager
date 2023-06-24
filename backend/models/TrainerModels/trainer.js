const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  pokemons: [{ type: String }],
});

module.exports = mongoose.model("Trainer", trainerSchema);
