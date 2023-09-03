import { Router } from "express";
const router = Router();
import * as orderController from "./controller/order.js";
import * as validators from "./validation.js";
import { validation } from "../../middelware/validation.js";
import isAuth from "../../middelware/authntication.js";

router.post(
  "/createOrder",
  isAuth,
  validation(validators.createOrder),
  orderController.createOrder
);

router.patch(
  "/:orderId",
  isAuth,
  validation(validators.cancelOrder),
  orderController.cancelOrder
);

router.get("/sucess", orderController.sucessPage);
router.get("/cancel", orderController.continuShopping);

export default router;
