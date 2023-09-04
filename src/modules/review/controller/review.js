import reviewModel from "../../../../DB/model/reviews.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createReview = asyncHandler(async (req, res, next) => {
  //user content >> data
  const { content, productId } = req.body;
  // check product
  const cProduct = productModel.findById(productId);
  if (!cProduct) return next(new Error("Product not found"), { cause: 404 });
  //add review to db
  const review = await reviewModel.create({
    user: req.user.id,
    content,
  });
  // add review to product
  const product = await productModel.findByIdAndUpdate(productId, {
    $push: { reviews: { id: review._id } },
  });
  return res.status(200).json({ message: "Done", review });
});
