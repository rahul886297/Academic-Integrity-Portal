import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import marksRoutes from "./routes/marks.js";
import metaRoutes from "./routes/meta.js";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/meta", metaRoutes);

import { protect } from "./middleware/authMiddleware.js";

app.get("/api/dashboard", protect, (req, res) => {
  res.json({ message: "Protected dashboard route", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
