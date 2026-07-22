import { Types } from "mongoose";

export type CategoryMap = {
  men: Types.ObjectId;
  women: Types.ObjectId;
  electronics: Types.ObjectId;
  shoes: Types.ObjectId;
};