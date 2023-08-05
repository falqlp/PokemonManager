const mongoose = require("mongoose");

const moveSchema = new mongoose.Schema({
  id: { type: Number, require: true, unique: true },
  name: { type: String, require: true, unique: true },
  type: { type: String, require: true },
  category: { type: String, require: true },
  accuracy: { type: Number, require: true },
  power: { type: Number },
  effect: { type: String },
});

module.exports = mongoose.model("Move", moveSchema);
