import { Schema, model, models, Model, InferSchemaType, HydratedDocument } from "mongoose";
import { PRODUCT_STATUS } from "../constants/product";
import { slugify } from "@/utils/slugify";

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const SpecificationSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const DimensionSchema = new Schema(
  {
    weight: Number,

    height: Number,

    width: Number,

    length: Number,
  },
  {
    _id: false,
  }
);

const SeoSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 200,
    },

    slug: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },


    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
    },

    costPrice: {
      type: Number, 
    }, 

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    brand: {
      type: String, 
      maxlength: 100,
      trim: true,
    },

    images: {
      type: [ImageSchema],
      default: [],
    },

    status: {
      type: String,
      enum:  Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.DRAFT,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

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

    seo: {
      type: SeoSchema,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    specifications: {
      type: [SpecificationSchema],
      default: [],
    },

    dimensions: {
      type: DimensionSchema,
    },

  },

  {
    timestamps: true,
  }
);

ProductSchema.pre("validate", async function (this: HydratedDocument<ProductType>) {
  if(this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

export type ProductType = InferSchemaType<typeof ProductSchema>;

const Product =
    (models.Product as Model<ProductType>) ||
    model<ProductType>(
      "Product",
      ProductSchema
    );

export default Product;

export type ProductImage = InferSchemaType<typeof ImageSchema>;

export type ProductSpecification = InferSchemaType<typeof SpecificationSchema>;

export type ProductDimension = InferSchemaType<typeof DimensionSchema>;

export type ProductSeo = InferSchemaType<typeof SeoSchema>;
