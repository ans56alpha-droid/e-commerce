import { Schema, model, models } from "mongoose";
import { uppercase } from "zod";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },


    price: {
      type: Number,
      required: true,
    },

    compareAtPrice: {
      type: Number,
      required: true,
    },

    costPrice: {
      type: Number,
      required: true,

      validate: {
        validator: function (v: number): boolean {
          return v >= 0;
        },
        message: "{VALUE} must be greater than or equal to 0",
      },
    },

    inventory: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String, 
      maxlength: 100,
      trim: true,
    },

    images: [
      {
        url: String,
        alt: String,
        isPrimary: Boolean,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    tags: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    salesCount: {
      type: Number,
      default: 0,
    },

    seoTitle: {
      type: String,
      trim: true,
    },

    seoDescription: {
      type: String,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    

  },

  {
    timestamps: true,
  }
);

export const Product =
  models.Product || model("Product", ProductSchema);