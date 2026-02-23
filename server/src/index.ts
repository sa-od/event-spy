import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import eventRoutes from "./routes/events";
import analyticsRoutes from "./routes/analytics";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow dashboard and any origin for SDK endpoints
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  }),
);

// SDK endpoints need open CORS
app.use("/api/events/batch", cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve SDK script
app.get("/sdk.js", (_req, res) => {
  const sdkPath = path.join(__dirname, "../../sdk/dist/tracker.js");
  if (fs.existsSync(sdkPath)) {
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(sdkPath);
  } else {
    res.status(404).send("// SDK not built yet. Run: cd sdk && npm run build");
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/eventspy")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

export default app;
