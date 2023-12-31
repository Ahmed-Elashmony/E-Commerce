import { Router } from "express";
const router = Router();
import * as orderController from "./controller/order.js";
import * as validators from "./validation.js";
import { validation } from "../../middelware/validation.js";
import isAuth from "../../middelware/authntication.js";
import express from "express";

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

//webhook

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  orderController.orderWebhook
);

export default router;
