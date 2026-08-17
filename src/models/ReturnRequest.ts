import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
} from "mongoose";

const ReturnRequestSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "returned",
        "refund_pending",
        "refunded",
      ],
      default: "requested",
      index: true,
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export type ReturnRequestType = InferSchemaType<
  typeof ReturnRequestSchema
>;

const ReturnRequest =
  (models.ReturnRequest as Model<ReturnRequestType>) ||
  model<ReturnRequestType>(
    "ReturnRequest",
    ReturnRequestSchema
  );

export default ReturnRequest;
