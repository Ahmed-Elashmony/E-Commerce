import { asyncHandler } from "../utils/errorHandling.js";

const isAuthen = (role) => {
  return asyncHandler(async (req, res, next) => {
    // check user
    if (role !== req.user.role) {
      return next(new Error("U Havnt Acess", { cause: 400 }));
    }
    return next();
  });
};

export default isAuthen;
