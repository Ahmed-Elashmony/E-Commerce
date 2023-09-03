import subCategoryModel from "../../../../DB/model/subCategory.js";
import categoryModel from "../../../../DB/model/category.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloud.js";
import slugify from "slugify";

export const createSub = asyncHandler(async (req, res, next) => {
  // categoryId
  const { categoryId } = req.params;
  //   check file
  if (!req.file) return next(new Error("image is required", { cause: 404 }));
  // check category
  const category = await categoryModel.findById(categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `eCommerce/subCategory` }
  );
  //   save in DB
  const subCategory = await subCategoryModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    categoryId,
  });
  return res.status(200).json({ message: "Done", subCategory });
});

export const updateSub = asyncHandler(async (req, res, next) => {
  // check category
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found"), { cause: 404 });
  // check subCategory
  const subCategory = await subCategoryModel.findOne({
    _id: req.params.subCategoryId,
    categoryId: req.params.categoryId,
  });
  if (!subCategory)
    return next(new Error("subCategory not found"), { cause: 404 });

  subCategory.name = req.body.name ? req.body.name : subCategory.name;
  subCategory.slug = req.body.name ? slugify(req.body.name) : subCategory.slug;

  // file
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subCategory.image.id,
    });
    subCategory.image.url = secure_url;
  }
  await subCategory.save();
  return res.status(200).json({ message: "Done", subCategory });
});

export const deleteSub = asyncHandler(async (req, res, next) => {
  // check category
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found"), { cause: 404 });
  // check subCategory
  const subCategory = await subCategoryModel.findOneAndDelete({
    _id: req.params.subCategoryId,
    categoryId: req.params.categoryId,
  });
  if (!subCategory)
    return next(new Error("subCategory not found"), { cause: 404 });

  return res.status(200).json({ messagee: "Done", subCategory });
});

export const allSubs = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel
    .find()
    .populate([{ path: "categoryId" }, { path: "createdBy" }]);

  return res.status(200).json({ messagee: "Done", subCategory });
});
