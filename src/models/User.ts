import {
    Schema,
    model,
    models,
    InferSchemaType,
    HydratedDocument,
  } from "mongoose";
  import { USER_ROLE } from "@/constants/user";
  
  const UserSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
  
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },
  
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
  
      image: {
        type: String,
        default: "",
      },
  
      role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default: USER_ROLE.CUSTOMER,
      },
  
      emailVerified: {
        type: Boolean,
        default: false,
      },
  
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  export type User = InferSchemaType<typeof UserSchema>;
  export type UserDocument = HydratedDocument<User>;
  
  export const UserModel =
    models.User || model<User>("User", UserSchema);