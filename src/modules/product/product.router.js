import { Router } from "express";
const router = Router({ mergeParams: true });
import * as productContoller from "./controller/product.js";
import { validation } from "../../middelware/validation.js";
import * as validators from "./validation.js";
import isAuth from "../../middelware/authntication.js";
import isAuthen from "../../middelware/authertion.js";
import { fileUpload, customValidation } from "../../utils/multer.js";

router.post(
  "/createProduct",
  isAuth,
  isAuthen("admin"),
  fileUpload(customValidation.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  validation(validators.createproduct),
  productContoller.createProduct
);

router.delete(
  "/deleteproduct/:productId",
  isAuth,
  isAuthen("admin"),
  validation(validators.productId),
  productContoller.deleteProduct
);

router.get("/", productContoller.allProduct);

router.get(
  "/:productId",
  validation(validators.productId),
  productContoller.singleProduct
);

router.get("/categoryId");

export default router;
