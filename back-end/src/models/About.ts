import mongoose, { Document, Schema } from "mongoose";

export interface IAbout extends Document {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  valuesTitle: string;
  values: Array<{
    title: string;
    description: string;
  }>;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  updatedAt: Date;
}

const aboutSchema = new Schema<IAbout>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Ensure only one document exists
aboutSchema.statics.getAbout = async function () {
  let about = await this.findOne();
  if (!about) {
    about = await this.create({});
  }
  return about;
};

export default mongoose.model<IAbout>("About", aboutSchema);

