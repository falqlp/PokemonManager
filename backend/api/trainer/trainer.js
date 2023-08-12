const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
  pcStorage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PcStorage",
    required: true,
  },
});

module.exports = mongoose.model("Trainer", trainerSchema);
