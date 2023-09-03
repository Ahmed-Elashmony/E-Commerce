import joi from "joi";
import { isValidObjectId } from "../../middelware/validation.js";

export const createOrder = joi
  .object({
    address: joi.string().min(10).required(),
    coupon: joi.string().length(5),
    phone: joi.string().required(),
    payment: joi.string().valid("cash", "visa").required(),
  })
  .required();

export const cancelOrder = joi
  .object({
    orderId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
