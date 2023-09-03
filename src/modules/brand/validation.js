import joi from "joi";
import { isValidObjectId } from "../../middelware/validation.js";

export const createbrand = joi
  .object({
    name: joi.string().required(),
  })
  .required();

export const updatebrand = joi
  .object({
    name: joi.string(),
    brandId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const deletebrand = joi
  .object({
    brandId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
