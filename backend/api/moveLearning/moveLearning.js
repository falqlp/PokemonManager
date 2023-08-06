const mongoose = require("mongoose");

const moveLearningSchema = new mongoose.Schema({
  learnMethod: { type: String, require: true },
  levelLearnAt: { type: Number },
  pokemonId: { type: Number, require: true },
  moveId: { type: String, require: true },
});

module.exports = mongoose.model("MoveLearning", moveLearningSchema);
