import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================= CORS CONFIG =======================
const corsOptions: cors.CorsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

// ======================= MIDDLEWARE =======================
app.use(express.json());
app.use(cookieParser());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================= ROUTES =======================

// Root route
app.get("/", (req: Request, res: Response) => {
    res.send("Auction_Xpress backend is running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// ======================= ERROR HANDLING =======================

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ message: "Internal server error" });
});

// ======================= SERVER START =======================
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});