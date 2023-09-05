// clear cart
import cartModel from "../../../DB/model/cart.model.js";
import ProductModel from "../../../DB/model/product.model.js";

export const clearCart = async (userId) => {
  await cartModel.findOneAndUpdate({ user: userId }, { product: [] });
};

// update stock
export const updateStock = async (products, placeOrder) => {
  if (placeOrder) {
    for (const product of products) {
      await ProductModel.findByIdAndUpdate(product.productId, {
        $inc: {
          availableItems: -product.quantity,
          soldItems: product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await ProductModel.findByIdAndUpdate(product.productId, {
        $inc: {
          availableItems: product.quantity,
          soldItems: -product.quantity,
        },
      });
    }
  }
};
