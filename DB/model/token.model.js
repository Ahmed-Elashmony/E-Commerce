import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    Valid: {
      type: Boolean,
      default: true,
    },
    agent: String,
    expiredAt: String,
  },
  { timestamps: true }
);

// mongoose.model.Token ||
const tokenModel = model("Token", tokenSchema);
export default tokenModel;
