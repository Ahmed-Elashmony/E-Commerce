import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("subCategory", {
  ref: "subCategory",
  localField: "_id", // category model
  foreignField: "categoryId", // subCategory model
});

const categoryModel = model("Category", categorySchema);
export default categoryModel;
