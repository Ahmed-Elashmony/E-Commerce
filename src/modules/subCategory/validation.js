import joi from "joi";
import { isValidObjectId } from "../../middelware/validation.js";

export const createSub = joi
  .object({
    name: joi.string().required(),
    categoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const updateSub = joi
  .object({
    name: joi.string(),
    categoryId: joi.string().custom(isValidObjectId).required(),
    subCategoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();

export const deleteSub = joi
  .object({
    categoryId: joi.string().custom(isValidObjectId).required(),
    subCategoryId: joi.string().custom(isValidObjectId).required(),
  })
  .required();
