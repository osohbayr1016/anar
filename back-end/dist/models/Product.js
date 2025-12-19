"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const colorStockSchema = new mongoose_1.Schema({
    color: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please add a product name"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Please add a price"],
        min: 0,
    },
    imageUrl: {
        type: String,
        required: [true, "Please add an image URL"],
    },
    category: {
        type: String,
        enum: ["Male", "Female", "Children", "Accessories"],
        required: [true, "Please add a category"],
    },
    description: {
        type: String,
        trim: true,
    },
    colors: [colorStockSchema],
    totalStock: {
        type: Number,
        min: 0,
    },
}, {
    timestamps: true,
});
productSchema.pre("save", function (next) {
    if (this.colors && this.colors.length > 0) {
        this.totalStock = this.colors.reduce((sum, color) => sum + color.quantity, 0);
    }
    next();
});
exports.default = mongoose_1.default.model("Product", productSchema);
