import cartModel from "../../../../DB/model/cart.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from "../../../../DB/model/product.model.js";

export const createCart = asyncHandler(async (req, res, next) => {
  //   check product
  const checkProduct = await productModel.findById(req.body.productId);
  if (!checkProduct) {
    return next(new Error("Product not found"), { cause: 404 });
  }
  if (!checkProduct.inStock(req.body.quantity)) {
    return next(
      new Error(
        `Sorry Only ${checkProduct.availableItems} items left on the stock`
      ),
      { cause: 400 }
    );
  }
  // check the product existence in cart
  const isProductInCart = await cartModel.findOne({
    user: req.user.id,
    "product.productId": req.body.productId,
  });

  if (isProductInCart) {
    isProductInCart.product.forEach((product) => {
      if (
        product.productId.toString() === req.body.productId.toString() &&
        req.body.quantity + product.quantity < checkProduct.availableItems
      ) {
        product.quantity = product.quantity + req.body.quantity;
      }
    });
    await isProductInCart.save();
    //   response
    return res.status(200).json({ message: "Done", isProductInCart });
  } else {
    //   add to cart
    const cart = await cartModel.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          product: {
            productId: req.body.productId,
            quantity: req.body.quantity,
          },
        },
      },
      { new: true }
    );
    //   response
    return res.status(200).json({ message: "Done", cart });
  }
});

export const getCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user.id }).populate({
    path: "product.productId",
    select: "-_id defaultImage.url name price discount finalPrice",
  });
  return cart
    ? res.status(200).json({ message: "Done", cart })
    : next(new Error("Cart not found"), { cause: 404 });
});

export const updateCart = asyncHandler(async (req, res, next) => {
  //   check product
  const checkProduct = await productModel.findById(req.body.productId);
  if (!checkProduct) {
    return next(new Error("Product not found"), { cause: 404 });
  }
  //   check quantity
  if (checkProduct.availableItems < req.body.quantity) {
    return next(
      new Error(
        `Sorry Only ${checkProduct.availableItems} items left on the stock`
      ),
      { cause: 400 }
    );
  }
  // update
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user.id, "product.productId": req.body.productId },
    {
      $set: { "product.$.quantity": req.body.quantity },
    },
    { new: true }
  );
  return res.status(200).json({ messaeg: "DONE", cart });
});

export const removeProduct = asyncHandler(async (req, res, next) => {
  const remove = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { product: { productId: req.params.productId } } },
    { new: true }
  );

  // response
  return res.status(200).json({ message: "Done", remove });
});

export const clear = asyncHandler(async (req, res, next) => {
  const clear = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    { product: [] },
    { new: true }
  );
  return res.status(200).json({ message: "Done", clear });
});
