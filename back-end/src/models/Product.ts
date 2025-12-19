import mongoose, { Document, Schema } from "mongoose";

export interface IColorStock {
  color: string;
  quantity: number;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  imageUrl: string;
  category: "Male" | "Female" | "Children" | "Accessories";
  description?: string;
  colors?: IColorStock[];
  totalStock?: number;
  createdAt: Date;
  updatedAt: Date;
}

const colorStockSchema = new Schema<IColorStock>(
  {
    color: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
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
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.colors && this.colors.length > 0) {
    this.totalStock = this.colors.reduce(
      (sum, color) => sum + color.quantity,
      0
    );
  }
  next();
});

export default mongoose.model<IProduct>("Product", productSchema);
