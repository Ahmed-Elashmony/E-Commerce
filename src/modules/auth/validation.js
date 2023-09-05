import joi from "joi";

export const SignUP = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi.string().empty(""),
    gender: joi.string().valid("male", "female").required(),
    age: joi.number().integer().min(18).max(60).required(),
    role: joi.string().valid("user", "admin"),
  })
  .required();

export const LogIn = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const confirmEmail = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();

export const forgetCode = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const resetPassword = joi
  .object({
    code: joi.string().length(5).required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
