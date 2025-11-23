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

dotenv.config();

const app = express();

// Connect to MongoDB
// Optional connect if URI exists, otherwise continue with mock data
if (process.env.MONGODB_URI) {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
