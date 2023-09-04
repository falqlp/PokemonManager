const mongoose = require("mongoose");

const battleSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    require: true,
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    require: true,
  },
  winner: { type: String },
});

module.exports = mongoose.model("Battle", battleSchema);
