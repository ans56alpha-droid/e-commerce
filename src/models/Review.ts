import {
  Schema,
  model,
  models,
  Model,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: (value: number) => value >= 1 && value <= 5,
        message: "Rating must be between 1 and 5",
      },
    },

    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export type ReviewType = InferSchemaType<typeof ReviewSchema>;

export type ReviewDocument = HydratedDocument<ReviewType>;

const Review =
  (models.Review as Model<ReviewType>) ||
  model<ReviewType>("Review", ReviewSchema);

export default Review;
