import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import Cryptr from "cryptr";
import crypto from "crypto";
import { SignUpTemp, resetPassTemp } from "../../../utils/html.js";
import sendEmail from "../../../utils/sentEmail.js";
import jwt from "jsonwebtoken";
import tokenModel from "../../../../DB/model/token.model.js";
import randomstring from "randomstring";
import cartModel from "../../../../DB/model/cart.model.js";

export const SignUP = asyncHandler(async (req, res, next) => {
  // data from request
  const { userName, email, password, gender, phone, role } = req.body;
  // check user exists
  const checkEmail = await userModel.findOne({ email });
  if (checkEmail) {
    return next(new Error("email is Registred before"), { cause: 400 });
  }
  const checkName = await userModel.findOne({ userName });
  if (checkName) {
    return next(new Error("userName must be unique"), { cause: 400 });
  }
  // hash password
  const hashPassword = bcryptjs.hashSync(password, +process.env.SALAT_ROUND);
  //   encrypt phone
  const cryptr = new Cryptr(process.env.CRPTO_PHONE);
  const encryptPhone = cryptr.encrypt(phone);
  // generate activation
  const activationCode = crypto.randomBytes(64).toString("hex");
  // create user
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone: encryptPhone,
    gender,
    role,
    activationCode,
  });
  // create confirmLink
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`;
  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: SignUpTemp(link),
  });
  // send response
  return !isSent
    ? res.status(200).json({ message: "Done", user })
    : res.json({ message: "something went wrong", isSent });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  // find user, delete acctivation code, update isConfimr
  const { activationCode } = req.params;
  const user = await userModel.findOneAndUpdate(
    { activationCode },
    {
      isConfirm: true,
      $unset: { activationCode: 1 },
    }
  );
  //   check if the user doens't exist
  if (!user) return next(new Error("user not found"), { cause: 404 });
  // create cart
  await cartModel.create({ user: user._id });
  // send response
  return res.send("Congratulations, ur acc is confirmed.");
});

export const LogIn = asyncHandler(async (req, res, next) => {
  // recive Data
  const { email, password } = req.body;
  // check Email
  const checkEmail = await userModel.findOne({ email });
  if (!checkEmail) return next(new Error("Email not found"), { cause: 404 });
  // check Confirmation
  if (!checkEmail.isConfirm) {
    return next(new Error("unConfirm Email"), { cause: 400 });
  }
  // check Password
  const matchPass = bcryptjs.compareSync(password, checkEmail.password);
  if (!matchPass) return next(new Error("Wrong password"), { cause: 400 });
  // create token and add Bearer
  const token = jwt.sign(
    { id: checkEmail._id, email: checkEmail.email },
    process.env.TOKEN_SIGNTURE,
    { expiresIn: 60 * 60 * 24 * 30 }
  );
  const BearerToken = process.env.BEARER_TOKEN + token;
  // save token in database
  await tokenModel.create({
    token,
    user: checkEmail._id,
    agent: req.headers["user-agent"],
  });
  // online
  checkEmail.isOnline = true;
  await checkEmail.save();
  // response
  return res.status(200).json({ message: "Done", BearerToken });
});

export const forgetCode = asyncHandler(async (req, res, next) => {
  // check email
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("email not found"), { cause: 404 });
  // generate code
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  // save code
  user.forgetCode = code;
  await user.save();
  // send email
  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: resetPassTemp(code),
  });
  return res.status(200).send("Done, check ur inbox");
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // check user
  const { code, password } = req.body;
  const user = await userModel.findOneAndUpdate(
    { forgetCode: code },
    { $unset: { forgetCode: 1 } }
  );
  if (!user) return next(new Error("inVaild Code", { cause: 404 }));
  // update password
  user.password = bcryptjs.hashSync(password, +process.env.SALAT_ROUND);
  await user.save();
  // inValid all tokens
  await tokenModel.updateMany({ user: user._id }, { Valid: false });
  // response
  return res.status(200).json({ message: "Done" });
});
