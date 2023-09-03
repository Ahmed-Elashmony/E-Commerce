export const validation = (Shema) => {
  return (req, res, next) => {
    const validationRueslt = Shema.validate(
      {
        ...req.params,
        ...req.body,
        ...req.query,
      },
      { abortEarly: false }
    );
    if (validationRueslt.error) {
      return res.json({
        message: "validation err",
        ValidationError: validationRueslt.error.details,
      });
    }
    return next();
  };
};

import { Types } from "mongoose";

export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid objectId");
};
