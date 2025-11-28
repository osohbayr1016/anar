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
// Always include these production frontend URLs
const defaultProductionOrigins = [
    "https://anar-gamma.vercel.app",
    "https://anar-shop.vercel.app",
    "https://anar-shop-git-main.vercel.app",
];
const getAllowedOrigins = () => {
    // If FRONTEND_URL is explicitly set, merge it with defaults
    if (process.env.FRONTEND_URL) {
        const customOrigins = process.env.FRONTEND_URL.split(",").map((url) => url.trim());
        // Merge with defaults and remove duplicates
        const allOrigins = [...new Set([...defaultProductionOrigins, ...customOrigins])];
        console.log("✅ CORS allowed origins from FRONTEND_URL:", allOrigins);
        return allOrigins;
    }
    // Check if we're in production (Render, Vercel, etc.)
    const isProduction = process.env.NODE_ENV === "production" ||
        process.env.RENDER === "true" ||
        process.env.VERCEL === "1" ||
        process.env.RENDER_SERVICE_NAME !== undefined;
    // In production, use default origins
    if (isProduction) {
        console.warn("⚠️  WARNING: FRONTEND_URL not set in production.");
        console.warn("⚠️  Using default production origins. Set FRONTEND_URL for security.");
        console.log("✅ CORS allowed origins (default production):", defaultProductionOrigins);
        return defaultProductionOrigins;
    }
    // Development origins
    const devOrigins = ["http://localhost:3000", "http://localhost:3001"];
    console.log("✅ CORS allowed origins (development):", devOrigins);
    return devOrigins;
};
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins();
        // If no origin (same-origin request, mobile apps, Postman, etc.), allow it
        if (!origin) {
            callback(null, true);
            return;
        }
        // Always allow Vercel domains (common frontend deployment)
        if (origin.includes("vercel.app") || origin.includes("vercel.com")) {
            callback(null, true);
            return;
        }
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        // Check if we're in production
        const isProduction = process.env.NODE_ENV === "production" ||
            process.env.RENDER === "true" ||
            process.env.VERCEL === "1" ||
            process.env.RENDER_SERVICE_NAME !== undefined;
        // In production without FRONTEND_URL, allow all as fallback for safety
        if (isProduction && !process.env.FRONTEND_URL) {
            console.warn(`⚠️  Allowing origin ${origin} (FRONTEND_URL not set, production mode)`);
            callback(null, true);
        }
        else {
            console.error(`❌ CORS blocked origin: ${origin}`);
            console.error(`   Allowed origins:`, allowedOrigins);
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
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
