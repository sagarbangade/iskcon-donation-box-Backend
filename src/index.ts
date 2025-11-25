import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import connectDB from "./config/db";

import authRoutes from "./routes/auth";
import areaRoutes from "./routes/areas";
import boxRoutes from "./routes/boxes";
import collectionRoutes from "./routes/collections";
import userRoutes from "./routes/users";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/", (_req, res) => {
  res.send("Donation API Running");
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/areas", areaRoutes);
app.use("/boxes", boxRoutes);
app.use("/collections", collectionRoutes);
app.use("/users", userRoutes);

const PORT: number = parseInt(process.env.PORT || "3001", 10);

// Connect to database first, then start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server running on port", PORT));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

