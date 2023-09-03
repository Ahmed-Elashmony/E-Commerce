import { Router } from "express";
const router = Router();
import { validation } from "../../middelware/validation.js";
import isAuthen from "../../middelware/authertion.js";
import isAuth from "../../middelware/authntication.js";
import * as cartController from "./controller/cart.js";
import * as validators from "./validation.js";

router.post(
  "/createCart",
  isAuth,
  validation(validators.product),
  cartController.createCart
);

router.get("/getCart", isAuth, cartController.getCart);
export default router;

router.patch(
  "/updateCart",
  isAuth,
  validation(validators.product),
  cartController.updateCart
);

router.patch(
  "/removeProduct/:productId",
  isAuth,
  validation(validators.productId),
  cartController.removeProduct
);

router.patch("/clear", isAuth, cartController.clear);
