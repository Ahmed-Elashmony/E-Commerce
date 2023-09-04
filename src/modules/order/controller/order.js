import orderModel from "../../../../DB/model/order.model.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import cartModel from "../../../../DB/model/cart.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { createInvoice } from "../../../utils/createInvoice.js";
import { fileURLToPath } from "url";
import path from "path";
import cloudinary from "../../../utils/cloud.js";
import sendEmail from "../../../utils/sentEmail.js";
import { clearCart, updateStock } from "../order.service.js";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createOrder = asyncHandler(async (req, res, next) => {
  //   check coupon
  let checkCoupon;
  if (req.body.coupon) {
    checkCoupon = await couponModel.findOne({
      name: req.body.coupon,
      expireAt: { $gt: Date.now() },
    });
  } else {
    return next(new Error("inValid coupon"), { cause: 404 });
  }

  //   check cart
  const cart = await cartModel.findOne({ user: req.user.id });
  const products = cart.product;
  if (products.length < 1) {
    return next(new Error("Empty cart!"), { cause: 404 });
  }
  let orderProducts = [];
  let orderPrice = [];

  //   check products
  for (let i = 0; i < products.length; i++) {
    // check product exist
    const product = await productModel.findById(products[i].productId);
    if (!product)
      return next(new Error(`Product ${products[i].productId} not found`));
    if (!product.inStock(products[i].quantity))
      return next(
        new Error(`${product.name} only ${product.availableItems} left`)
      );

    orderProducts.push({
      productId: product._id,
      quantity: products[i].quantity,
      name: product.name,
      itemPrice: product.finalPrice,
      totalPrice: products[i].quantity * product.finalPrice,
    });

    orderPrice = +(products[i].quantity * product.finalPrice) + +orderPrice;
  }
  // creat order
  const order = await orderModel.create({
    user: req.user.id,
    products: orderProducts,
    address: req.body.address,
    phone: req.body.phone,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    payment: req.body.payment,
    price: orderPrice,
  });
  //   generate invoice
  const invoice = {
    shipping: {
      name: req.user.userName,
      address: order.address,
      country: "EGY",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };

  const pdfPath =
    process.env.NODE_ENV === "DEV"
      ? path.join(__dirname, `../../../../invoiceTemp/${order._id}.pdf`)
      : `/tmp/${order._id}.pdf`;
  createInvoice(invoice, pdfPath);

  //   upload cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `eCommerce/order/${req.user.id}/invoice/${req.user.id}`,
  });

  // TODO delete file from filesystem
  // add invoice to order
  order.invoice = { id: public_id, url: secure_url };
  await order.save();
  //   send email

  const isSent = await sendEmail({
    to: req.user.email,
    subject: "Order Invoice",
    attachments: [
      {
        path: secure_url,
        contentType: "application/pdf",
      },
    ],
  });

  if (isSent) {
    //   update stock
    updateStock(order.products, true);
    //   clear cart
    clearCart(req.user.id);
  } else {
    return next(new Error("faild to sent"));
  }
  // stripe payment
  if (order.payment == "visa") {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    let existCoupon;
    if (order.coupon.name !== undefined) {
      existCoupon = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }

    const seisson = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: { order_id: order._id.toString() },
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: product.name,
              // image: product.productId.defaultImage.url,
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: existCoupon ? [{ coupon: existCoupon.id }] : [],
    });
    return res.json({ success: true, result: seisson.url });
  }
  // response
  return res.status(200).json({ message: "Done", order });
  // discount not working
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) return next(new Error("Order not found"), { cause: 404 });
  if (order.status === "shipped" || order.status === "delivered") {
    return next(new Error("can not cancel order"));
  }
  order.status = "canceled";
  await order.save();

  updateStock(order.products, false);

  return res.status(200).json({ message: "cancel successfly", order });
});

export const sucessPage = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: "success order" });
});

export const continuShopping = asyncHandler(async (req, res, next) => {
  return res.status(200).json({ message: "Shopping Page" });
});

export const orderWebhook = asyncHandler(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  const stripe = new Stripe(process.env.ENDPOINT_SECRET);
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.ENDPOINT_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const orderId = event.data.object.metadata.order_id;
  if (event.type === "checkout.session.completed") {
    // change order status
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: "visa Paied" }
    );
    // clear and update cart
    return;
  }
  await orderModel.findOneAndUpdate(
    { _id: orderId },
    { status: "failed to pay" }
  );
  return;
});
