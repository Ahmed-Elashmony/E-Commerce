import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const reviewModel = model("Review", reviewSchema);
export default reviewModel;
