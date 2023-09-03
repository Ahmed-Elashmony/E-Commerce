import BrandModel from "../../../../DB/model/brand.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloud.js";
import slugify from "slugify";

export const createBrand = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) {
    return next(new Error("brand Image Required"), { cause: 404 });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `eCommerce/brand` }
  );
  // save brand in DB
  const brand = await BrandModel.create({
    name: req.body.name,
    createdBy: req.user.id,
    image: { id: public_id, url: secure_url },
    slug: slugify(req.body.name),
  });
  // respone
  return res.status(201).json({ message: "Done", brand });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  // check brand
  const brand = await BrandModel.findById(req.params.brandId);
  if (!brand) return next(new Error("brand not found"), { cause: 404 });

  // name and slug
  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;
  //   file
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: brand.image.id }
    );
    brand.image.url = secure_url;
  }
  //   save brand
  await brand.save();

  return res.status(200).json({ message: "Done", brand });
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  // check brand
  const brand = await BrandModel.findById(req.params.brandId);
  if (!brand) return next(new Error("brand not found"), { cause: 404 });

  //   delete image
  await cloudinary.uploader.destroy(brand.image.id);

  //   delete brand
  await BrandModel.findByIdAndDelete(req.params.brandId);

  return res.status(300).json({ messaeg: "Done" });
});

export const allBrand = asyncHandler(async (req, res, next) => {
  const brand = await BrandModel.find();

  return res.status(200).json({ messaeg: "Done", brand });
});
