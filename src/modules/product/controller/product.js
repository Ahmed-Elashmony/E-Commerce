import ProductModel from "../../../../DB/model/product.model.js";
import categoryModel from "../../../../DB/model/category.model.js";
import BrandModel from "../../../../DB/model/brand.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloud.js";
import { nanoid } from "nanoid";

export const createProduct = asyncHandler(async (req, res, next) => {
  // file
  if (!req.files) {
    return next(new Error("product Image Required"), { cause: 404 });
  }
  let images = [];
  // check category
  const category = await categoryModel.findById(req.body.category);
  if (!category) return next(new Error("category not found"), { cause: 404 });

  // check subCategory
  const subcategory = await subCategoryModel.findById(req.body.subCategory);
  if (!subcategory)
    return next(new Error("subCategory not found"), { cause: 404 });

  // check brand
  const brand = await BrandModel.findById(req.body.brandId);
  if (!brand) return next(new Error("brand not found"), { cause: 404 });

  // create unique folder
  const cloudfolder = nanoid();
  //   upload files
  for (const file of req.files.images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `eCommerce/products/${cloudfolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }
  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `eCommerce/products/${cloudfolder}` }
  );
  // save product in DB
  const product = await ProductModel.create({
    ...req.body,
    cloudfolder,
    createdBy: req.user.id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });
  // respone
  return res.status(201).json({ message: "Done", product });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product
  const product = await ProductModel.findById(req.params.productId);
  if (!product) return next(new Error("product not found"), { cause: 404 });

  //   delete image
  const imageArr = product.images;
  const ids = imageArr.map((imageObj) => imageObj.id);
  ids.push(product.defaultImage.id);

  const result = await cloudinary.api.delete_resources(ids);

  // delete folder
  await cloudinary.api.delete_folder(
    `eCommerce/products/${product.cloudfolder}`
  );
  //   delete product
  await ProductModel.findByIdAndDelete(req.params.productId);

  return res.status(300).json({ messaeg: "Done" });
});

export const allProduct = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) return next(new Error("Category not found"), { cause: 404 });
    const product = await ProductModel.find({
      category: req.params.categoryId,
    });
    return res.json({ message: "Done", product });
  }
  //   search
  // const { keyword } = req.query;
  // const product = await ProductModel.find({
  //   $or: [
  //     { name: { $regex: keyword, $options: "i" } },
  //     { description: { $regex: keyword, $options: "i" } },
  //   ],
  // });

  const product = await ProductModel.find({ ...req.query })
    .paginate(req.query.page)
    .selection(req.query.fileds)
    .sort(req.query.sort);
  return res.status(200).json({ messaeg: "Done", product });
});

export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.productId);
  if (!product) return next(new Error("Product not found"), { cause: 404 });
  return res.status(200).json({ messaeg: "Done", product });
});
