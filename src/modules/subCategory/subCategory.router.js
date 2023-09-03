import * as subCategoryController from "./controller/subCategory.js";
import { Router } from "express";
const router = Router({ mergeParams: true });
import { validation } from "../../middelware/validation.js";
import * as validators from "./validation.js";
import isAuth from "../../middelware/authntication.js";
import isAuthen from "../../middelware/authertion.js";
import { fileUpload, customValidation } from "../../utils/multer.js";

router.post(
  "/create",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).single("image"),
  validation(validators.createSub),
  subCategoryController.createSub
);

router.patch(
  "/:subCategoryId",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).single("image"),
  validation(validators.updateSub),
  subCategoryController.updateSub
);

router.delete(
  "/:subCategoryId",
  isAuth,
  isAuthen("admin"),
  validation(validators.deleteSub),
  subCategoryController.deleteSub
);

router.get("/allSubs", subCategoryController.allSubs);

export default router;
