import {
  Schema,
  model,
  models,
  InferSchemaType,
  Model,
} from "mongoose";

const AddressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "Pakistan",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export type AddressType = InferSchemaType<typeof AddressSchema>;

const Address =
  (models.Address as Model<AddressType>) ||
  model<AddressType>("Address", AddressSchema);

export default Address;
