const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Counter = require("../models/Counter");

// Auto-generate itemId middleware
const getNextItemId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: "itemId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// Create (POST)
app.post("/api/add", async (req, res) => {
  try {
    const newItemId = await getNextItemId();  // Get the next integer for itemId

    const newItem = new Item({
      itemId: newItemId,
      name: req.body.name,
      quantity: req.body.quantity
    });

    const savedItem = await newItem.save();
    res.json(savedItem);  // Return the saved item
  } catch (error) {
    res.status(500).json({ error: "Error adding item" });
  }
});

// Read (GET)
router.get("/get", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items); // Items will include itemId
  } catch (error) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// Update (PUT)
router.put("/update/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { name, quantity } = req.body;

  try {
    const updatedItem = await Item.findOneAndUpdate(
      { itemId: itemId }, // Find item by itemId, not _id
      { name, quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send("Item not found");
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete (DELETE)
router.delete("/delete/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const deletedItem = await Item.findOneAndDelete({ itemId: itemId });
    if (!deletedItem) {
      return res.status(404).send("Item not found");
    }
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
