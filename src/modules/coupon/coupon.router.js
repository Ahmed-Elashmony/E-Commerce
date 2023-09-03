import { Router } from "express";
const router = Router();
import * as couponController from "./controller/coupon.js";
import * as validators from "./validation.js";
import isAuthen from "../../middelware/authertion.js";
import isAuth from "../../middelware/authntication.js";
import { validation } from "../../middelware/validation.js";

router.post(
  "/createCoupon",
  isAuth,
  isAuthen("admin"),
  validation(validators.createCoupon),
  couponController.createCoupon
);

router.patch(
  "/:code",
  isAuth,
  isAuthen("admin"),
  validation(validators.updateCoupon),
  couponController.updateCoupon
);

router.delete(
  "/:code",
  isAuth,
  isAuthen("admin"),
  validation(validators.deleteCoupon),
  couponController.deleteCoupon
);

router.get("/all", couponController.allCoupons);

export default router;
