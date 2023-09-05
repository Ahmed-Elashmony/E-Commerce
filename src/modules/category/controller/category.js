import categoryModel from "../../../../DB/model/category.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloud.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) {
    return next(new Error("Category Image Required"), { cause: 404 });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `eCommerce/category` }
  );
  // save category in DB
  const category = await categoryModel.create({
    name: req.body.name,
    createdBy: req.user.id,
    image: { id: public_id, url: secure_url },
    slug: slugify(req.body.name),
  });
  // respone
  return res.status(201).json({ message: "Done", category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found"), { cause: 404 });

  // name and slug
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  //   file
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image.url = secure_url;
  }
  //   save category
  await category.save();

  return res.status(200).json({ message: "Done", category });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found"), { cause: 404 });

  //   delete image
  await cloudinary.uploader.destroy(category.image.id);

  //   delete category
  await categoryModel.findByIdAndDelete(req.params.categoryId);

  // delete subCategory
  await subCategoryModel.deleteMany({ categoryId: req.params.categoryId });
  return res.status(300).json({ messaeg: "Done" });
});

export const allCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel
    .find()
    .populate({ path: "subCategory", populate: [{ path: "createdBy" }] });

  return res.status(200).json({ messaeg: "Done", category });
});
