import joi from "joi";
import { isValidObjectId } from "../../middelware/validation.js";

export const product = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
    quantity: joi.number().integer().positive().required(),
  })
  .required();

export const productId = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
