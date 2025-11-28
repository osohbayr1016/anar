import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import productsRouter from "./services/products";
import authRouter from "./services/auth";
import ordersRouter from "./services/orders";
import reviewsRouter from "./services/reviews";
import ticketsRouter from "./services/tickets";
import categoriesRouter from "./services/categories";
import aboutRouter from "./services/about";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});

// CORS configuration
const getAllowedOrigins = (): string[] | boolean => {
  if (process.env.FRONTEND_URL) {
    const origins = process.env.FRONTEND_URL.split(",").map((url) =>
      url.trim()
    );
    console.log("✅ CORS allowed origins:", origins);
    return origins;
  }

  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  WARNING: FRONTEND_URL not set in production.");
    console.warn(
      "⚠️  Allowing all origins as fallback. Please set FRONTEND_URL for security."
    );
    return true; // Allow all origins in production if FRONTEND_URL not set
  }

  return ["http://localhost:3000", "http://localhost:3001"];
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};

// Log CORS configuration on startup
console.log("🔧 CORS Configuration:");
console.log("   Environment:", process.env.NODE_ENV || "development");
console.log("   FRONTEND_URL:", process.env.FRONTEND_URL || "NOT SET");
console.log("   Allowed Origins:", getAllowedOrigins());

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting (apply to all routes except health check)
app.use((req, res, next) => {
  if (req.path === "/health") {
    return next();
  }
  rateLimiter(req, res, next);
});

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Anar Shop API",
    status: "running",
    database: "connected",
  });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// API routes
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/about", aboutRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  })
  .on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please use a different port.`
      );
    } else {
      console.error("Server error:", error);
    }
    process.exit(1);
  });
