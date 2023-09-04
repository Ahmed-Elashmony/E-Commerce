import * as reviewController from "./controller/review.js";
import { Router } from "express";
const router = Router({ mergeParams: true });
import isAuth from "../../middelware/authntication.js";

router.post("/create", isAuth, reviewController.createReview);

export default router;
