"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const products_1 = __importDefault(require("./services/products"));
const auth_1 = __importDefault(require("./services/auth"));
const orders_1 = __importDefault(require("./services/orders"));
const reviews_1 = __importDefault(require("./services/reviews"));
const tickets_1 = __importDefault(require("./services/tickets"));
const categories_1 = __importDefault(require("./services/categories"));
const about_1 = __importDefault(require("./services/about"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)().catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
});
// CORS configuration
const getAllowedOrigins = () => {
    if (process.env.FRONTEND_URL) {
        const origins = process.env.FRONTEND_URL.split(",").map((url) => url.trim());
        console.log("✅ CORS allowed origins:", origins);
        return origins;
    }
    if (process.env.NODE_ENV === "production") {
        console.warn("⚠️  WARNING: FRONTEND_URL not set in production. Allowing all origins.");
        console.warn("⚠️  Please set FRONTEND_URL environment variable for security.");
        return true; // Allow all origins temporarily if FRONTEND_URL not set
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
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Rate limiting (apply to all routes except health check)
app.use((req, res, next) => {
    if (req.path === "/health") {
        return next();
    }
    (0, rateLimiter_1.rateLimiter)(req, res, next);
});
// Basic route
app.get("/", (req, res) => {
    res.json({
        message: "Anar Shop API",
        status: "running",
        database: "connected",
    });
});
// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});
// API routes
app.use("/api/products", products_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/reviews", reviews_1.default);
app.use("/api/tickets", tickets_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/about", about_1.default);
// 404 handler
app.use(errorHandler_1.notFoundHandler);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
app
    .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
})
    .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
    }
    else {
        console.error("Server error:", error);
    }
    process.exit(1);
});
