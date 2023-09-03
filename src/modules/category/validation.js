import joi from "joi";
import { isValidObjectId } from "../../middelware/validation.js";

export const createCategory = joi
  .object({
    name: joi.string().required(),
    createdBy: joi.string().custom(isValidObjectId),
  })
  .required();

export const updateCategory = joi
  .object({
    name: joi.string(),
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const deleteCategory = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
