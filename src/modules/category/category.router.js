import { Router } from "express";
const router = Router();
import * as categoryContoller from "./controller/category.js";
import { validation } from "../../middelware/validation.js";
import * as validators from "./validation.js";
import isAuth from "../../middelware/authntication.js";
import isAuthen from "../../middelware/authertion.js";
import { fileUpload, customValidation } from "../../utils/multer.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import productRouter from "../product/product.router.js";

router.use("/:categoryId/subCategory", subCategoryRouter);
router.use("/:categoryId/product", productRouter);

router.post(
  "/createCategory",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).single("image"),
  validation(validators.createCategory),
  categoryContoller.createCategory
);

router.patch(
  "/update/:categoryId",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).single("image"),
  validation(validators.updateCategory),
  categoryContoller.updateCategory
);

router.delete(
  "/deleteCategory/:categoryId",
  isAuth,
  isAuthen("admin"),
  validation(validators.deleteCategory),
  categoryContoller.deleteCategory
);

router.get("/", categoryContoller.allCategory);

export default router;
