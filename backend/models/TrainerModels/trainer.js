const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
});

module.exports = mongoose.model("Trainer", trainerSchema);
