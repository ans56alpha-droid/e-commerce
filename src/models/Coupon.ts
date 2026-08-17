import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
} from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    usageLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    perUserLimit: {
      type: Number,
      default: 1,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export type CouponType = InferSchemaType<typeof CouponSchema>;

const Coupon =
  (models.Coupon as Model<CouponType>) ||
  model<CouponType>("Coupon", CouponSchema);

export default Coupon;
