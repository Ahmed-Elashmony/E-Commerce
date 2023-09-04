import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    defaultImage: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    availableItems: { type: Number, min: 0, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 0, required: true },
    discount: { type: Number, min: 1, max: 100 }, // %
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Types.ObjectId, ref: "subCategory", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudfolder: { type: String, unique: true },
    reviews: [{ id: { type: Types.ObjectId, ref: "Review" } }],
  },
  { timestamps: true, strictQuery: true, toJSON: { virtuals: true } }
);

// virtual
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

// Query Helper
productSchema.query.paginate = function (page) {
  // page
  page = !page || page < 1 || isNaN(page) ? 1 : page;
  const limit = 2;
  const skip = limit * (page - 1);

  // pagination
  return this.skip(skip).limit(limit);
};

productSchema.query.selection = function (fileds) {
  if (!fileds) return this;
  // all fileds i have to prevent the strange filed
  const modelKeys = Object.keys(ProductModel.schema.paths);
  const queryKeys = fileds.split(" ");
  // matched keys
  const mathcedKeys = queryKeys.filter((key) => modelKeys.includes(key));
  return this.select(mathcedKeys);
};

// stock function
productSchema.methods.inStock = function (requiredQuantity) {
  return this.availableItems >= requiredQuantity ? true : false;
  s;
};

const ProductModel = model("Product", productSchema);
export default ProductModel;
