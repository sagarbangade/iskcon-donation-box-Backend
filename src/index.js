require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const areaRoutes = require("./routes/areas");
const boxRoutes = require("./routes/boxes");
const collectionRoutes = require("./routes/collections");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("pong");
});
app.get("/", (req, res) => {
  res.send("Donation API Running");
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/areas", areaRoutes);
app.use("/boxes", boxRoutes);
app.use("/collections", collectionRoutes);


const PORT = process.env.PORT || 3000;

// Connect to database first, then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server running on port", PORT));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();