import { Types } from "mongoose";

export type Populated<T> = T & {
    _id: Types.ObjectId;
}