import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
} from "mongoose";

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "order_placed",
        "payment_successful",
        "payment_failed",
        "order_processing",
        "order_shipped",
        "order_delivered",
        "order_cancelled",
        "return_requested",
        "return_approved",
        "return_rejected",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export type NotificationType = InferSchemaType<
  typeof NotificationSchema
>;

const Notification =
  (models.Notification as Model<NotificationType>) ||
  model<NotificationType>(
    "Notification",
    NotificationSchema
  );

export default Notification;
