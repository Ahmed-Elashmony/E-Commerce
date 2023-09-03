import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    brand: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: true }
);

const subCategoryModel = model("subCategory", subCategorySchema);
export default subCategoryModel;
