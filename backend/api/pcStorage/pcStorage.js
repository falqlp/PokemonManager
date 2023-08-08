const mongoose = require("mongoose");

const pcStorageSchema = new mongoose.Schema({
  maxSize: { type: Number, required: true },
  storage: [
    { pokemon: { type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" } },
    { position: { type: Number, required: true } },
  ],
});

module.exports = mongoose.model("PcStorage", pcStorageSchema);
