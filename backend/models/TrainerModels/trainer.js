const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, require: true },
  pokemons: [{ type: String }],
});

module.exports = mongoose.model("Trainer", trainerSchema);
