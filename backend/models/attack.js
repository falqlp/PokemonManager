const mongoose = require("mongoose");

const attackSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  type: { type: String, require: true },
  category: { type: String, require: true },
  precision: { type: Number, require: true },
  power: { type: Number },
  effect: { type: String },
});

module.exports = mongoose.model("Attack", attackSchema);
