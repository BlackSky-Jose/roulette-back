import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";

dotenv.config();
const app = express();

// CORS configuration - allow Vercel and all origins
const corsOptions = {
  origin: process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL 
    : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow all origins in production
        callback(null, true);
      },
  credentials: false, // JWT tokens in headers, not cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
