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
const aboutSchema = new mongoose_1.Schema({
    heroTitle: {
        type: String,
        default: "Бидний тухай",
    },
    heroSubtitle: {
        type: String,
        default: "Монголд бүтээгдсэн. Дэлхий даяар өмсөгддөг.",
    },
    storyTitle: {
        type: String,
        default: "Манай түүх",
    },
    storyParagraphs: {
        type: [String],
        default: [
            "Anar Shop бол загварын сонирхолтой хүмүүсийн бүтээл юм. Бид чанартай, орчин үеийн хувцас, хэрэглэлүүдийг Монголын хэрэглэгчдэд хүргэх зорилготой.",
            "Манай бүтээгдэхүүнүүд нь хамгийн сайн чанартай материал, анхааралтай хийгдсэн дизайн, байгаль орчинд ээлтэй үйлдвэрлэл зэргээр онцлогтой.",
            "Бид зөвхөн хувцас борлуулахгүй, харин таны амьдралын хэв маягийг илэрхийлэх арга замыг санал болгодог.",
        ],
    },
    valuesTitle: {
        type: String,
        default: "Манай үнэт зүйлс",
    },
    values: {
        type: [
            {
                title: String,
                description: String,
            },
        ],
        default: [
            {
                title: "Чанар",
                description: "Бид зөвхөн хамгийн сайн чанартай бүтээгдэхүүн санал болгодог",
            },
            {
                title: "Хэрэглэгч",
                description: "Таны сэтгэл ханамж бидний тэргүүн зорилго",
            },
            {
                title: "Байгаль орчин",
                description: "Байгаль орчинд ээлтэй үйлдвэрлэл, бүтээгдэхүүн",
            },
        ],
    },
    contactTitle: {
        type: String,
        default: "Холбоо барих",
    },
    contactEmail: {
        type: String,
        default: "info@anarshop.mn",
    },
    contactPhone: {
        type: String,
        default: "+976 1234 5678",
    },
    contactAddress: {
        type: String,
        default: "Улаанбаатар хот, Сүхбаатар дүүрэг",
    },
}, {
    timestamps: true,
});
// Ensure only one document exists
aboutSchema.statics.getAbout = async function () {
    let about = await this.findOne();
    if (!about) {
        about = await this.create({});
    }
    return about;
};
exports.default = mongoose_1.default.model("About", aboutSchema);
