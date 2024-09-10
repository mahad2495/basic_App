// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// backend/server.js
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
// Add this line to import the routes

const itemRoutes = require("./Routes/itemRoutes");

// backend/server.js

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Proceed to the next middleware or route handler
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the CRUD App");
});

// Use the routes
app.use("/api", itemRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
