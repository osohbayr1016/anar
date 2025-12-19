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
const upload_1 = __importDefault(require("./services/upload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to MongoDB
if (process.env.MONGODB_URI) {
    (0, database_1.default)();
}
else {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
}
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use("/api/upload", upload_1.default);
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
