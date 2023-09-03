import * as authController from "./controller/auth.js";
import { Router } from "express";
const router = Router();
import { validation } from "../../middelware/validation.js";
import * as validators from "./validation.js";

// register
router.post("/SignUp", validation(validators.SignUP), authController.SignUP);

// activate account
router.get(
  "/confirmEmail/:activationCode",
  validation(validators.confirmEmail),
  authController.confirmEmail
);

// Login

router.post("/LogIn", validation(validators.LogIn), authController.LogIn);

// sent forget password code

router.patch(
  "/forgetCode",
  validation(validators.forgetCode),
  authController.forgetCode
);

// Reset Password

router.patch(
  "/resetPassword",
  validation(validators.resetPassword),
  authController.resetPassword
);

export default router;
