"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const About_1 = __importDefault(require("../models/About"));
const database_1 = __importDefault(require("../config/database"));
dotenv_1.default.config();
const migrateAbout = async () => {
    try {
        await (0, database_1.default)();
        console.log("Connected to MongoDB");
        // Check if About document exists
        let about = await About_1.default.findOne();
        if (!about) {
            // Create new About document with default values
            about = await About_1.default.create({
                heroTitle: "Бидний тухай",
                heroSubtitle: "Монголд бүтээгдсэн. Дэлхий даяар өмсөгддөг.",
                storyTitle: "Манай түүх",
                storyParagraphs: [
                    "Anar Shop бол загварын сонирхолтой хүмүүсийн бүтээл юм. Бид чанартай, орчин үеийн хувцас, хэрэглэлүүдийг Монголын хэрэглэгчдэд хүргэх зорилготой.",
                    "Манай бүтээгдэхүүнүүд нь хамгийн сайн чанартай материал, анхааралтай хийгдсэн дизайн, байгаль орчинд ээлтэй үйлдвэрлэл зэргээр онцлогтой.",
                    "Бид зөвхөн хувцас борлуулахгүй, харин таны амьдралын хэв маягийг илэрхийлэх арга замыг санал болгодог.",
                ],
                valuesTitle: "Манай үнэт зүйлс",
                values: [
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
                contactTitle: "Холбоо барих",
                contactEmail: "info@anarshop.mn",
                contactPhone: "+976 1234 5678",
                contactAddress: "Улаанбаатар хот, Сүхбаатар дүүрэг",
            });
            console.log("✅ About page content migrated successfully!");
            console.log("Created About document with ID:", about._id);
        }
        else {
            // Update existing document to ensure all fields are present
            const updates = {};
            if (!about.heroTitle)
                updates.heroTitle = "Бидний тухай";
            if (!about.heroSubtitle)
                updates.heroSubtitle = "Монголд бүтээгдсэн. Дэлхий даяар өмсөгддөг.";
            if (!about.storyTitle)
                updates.storyTitle = "Манай түүх";
            if (!about.storyParagraphs || about.storyParagraphs.length === 0) {
                updates.storyParagraphs = [
                    "Anar Shop бол загварын сонирхолтой хүмүүсийн бүтээл юм. Бид чанартай, орчин үеийн хувцас, хэрэглэлүүдийг Монголын хэрэглэгчдэд хүргэх зорилготой.",
                    "Манай бүтээгдэхүүнүүд нь хамгийн сайн чанартай материал, анхааралтай хийгдсэн дизайн, байгаль орчинд ээлтэй үйлдвэрлэл зэргээр онцлогтой.",
                    "Бид зөвхөн хувцас борлуулахгүй, харин таны амьдралын хэв маягийг илэрхийлэх арга замыг санал болгодог.",
                ];
            }
            if (!about.valuesTitle)
                updates.valuesTitle = "Манай үнэт зүйлс";
            if (!about.values || about.values.length === 0) {
                updates.values = [
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
                ];
            }
            if (!about.contactTitle)
                updates.contactTitle = "Холбоо барих";
            if (!about.contactEmail)
                updates.contactEmail = "info@anarshop.mn";
            if (!about.contactPhone)
                updates.contactPhone = "+976 1234 5678";
            if (!about.contactAddress)
                updates.contactAddress = "Улаанбаатар хот, Сүхбаатар дүүрэг";
            if (Object.keys(updates).length > 0) {
                await About_1.default.findOneAndUpdate({}, updates, { new: true });
                console.log("✅ About page content updated successfully!");
                console.log("Updated fields:", Object.keys(updates));
            }
            else {
                console.log("ℹ️  About page content already exists and is up to date.");
            }
        }
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
};
// Run migration
migrateAbout();
