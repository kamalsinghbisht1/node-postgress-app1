// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
// import newbookingprocessRoutes from "./routes/newbookingprocessRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend

// ✅ Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🧠 Basic health check route
app.get("/", (req, res) => {
  res.send("✅ API is running successfully...");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Routes
app.use("/api/booking", bookingRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));













