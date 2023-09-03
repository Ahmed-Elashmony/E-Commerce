import joi from "joi";
import { isValidObjectId } from "../../middelware/validation.js";

export const createproduct = joi
  .object({
    name: joi.string().required(),
    description: joi.string().required(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidObjectId).required(),
    subCategory: joi.string().custom(isValidObjectId).required(),
    brandId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const updateproduct = joi
  .object({
    name: joi.string(),
    productId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const productId = joi
  .object({
    productId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
