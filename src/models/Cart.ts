import {
  Schema,
  model,
  models,
  Model,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

CartSchema.index({ "items.product": 1 });

export type CartItem = InferSchemaType<typeof CartItemSchema>;

export type CartType = InferSchemaType<typeof CartSchema>;

export type CartDocument = HydratedDocument<CartType>;

const Cart =
  (models.Cart as Model<CartType>) || model<CartType>("Cart", CartSchema);

export default Cart;
