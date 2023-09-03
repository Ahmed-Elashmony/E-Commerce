import { Router } from "express";
const router = Router();
import * as brandContoller from "./controller/brand.js";
import { validation } from "../../middelware/validation.js";
import * as validators from "./validation.js";
import isAuth from "../../middelware/authntication.js";
import isAuthen from "../../middelware/authertion.js";
import { fileUpload, customValidation } from "../../utils/multer.js";

router.post(
  "/createbrand",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).single("image"),
  validation(validators.createbrand),
  brandContoller.createBrand
);

router.patch(
  "/update/:brandId",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).single("image"),
  validation(validators.updatebrand),
  brandContoller.updateBrand
);

router.delete(
  "/deletebrand/:brandId",
  isAuth,
  isAuthen("admin"),
  validation(validators.deletebrand),
  brandContoller.deleteBrand
);

router.get("/", brandContoller.allBrand);

export default router;
