const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: { type: Number, required: true, unique: true },  // Unique integer item ID
  name: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
