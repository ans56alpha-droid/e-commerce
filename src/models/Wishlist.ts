import { Schema, model, models, type Document, type Types } from "mongoose";

export interface WishlistType extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<WishlistType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist =
  models.Wishlist ||
  model<WishlistType>("Wishlist", WishlistSchema);

export default Wishlist;