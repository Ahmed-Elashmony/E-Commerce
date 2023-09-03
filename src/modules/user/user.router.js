import { Router } from "express";
const router = Router();
import * as userController from "./controller/user.js";
import { validation } from "../../middelware/validation.js";
import * as validators from "./validation.js";

// router.get("/",userController.)

export default router;
