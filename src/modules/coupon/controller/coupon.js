import couponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import voucher_code from "voucher-code-generator";

export const createCoupon = asyncHandler(async (req, res, next) => {
  // generate coupon
  const code = voucher_code.generate({ length: 5 });

  // create coupon
  const coupon = await couponModel.create({
    name: code[0],
    discount: req.body.discount,
    expireAt: new Date(req.body.expireAt).getTime(),
    createdBy: req.user._id,
  });
  return res.status(200).json({ message: "Done", coupon });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  console.log(req.params.code);
  const coupon = await couponModel.findOne({
    name: req.params.code,
    expireAt: { $gt: Date.now() },
  });
  console.log("coupon", coupon);
  if (!coupon) return next(new Error("inVaild coupon"), { cause: 404 });
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiresAt = req.body.expiresAt
    ? new Date(req.body.expiresAt).getTime()
    : coupon.expiresAt;

  await coupon.save();
  return res.status(200).json({ message: "Done", coupon });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  const coupon = await couponModel.findOneAndDelete({ name: req.params.code });
  if (!coupon) return next(new Error("Coupon not found"), { cause: 404 });

  return res.status(200).json({ message: "Done", coupon });
});

export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.find();
  return res.status(200).json({ message: "Done", coupon });
});
