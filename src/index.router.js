import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import categoryRouter from "./modules/category/category.router.js";
import subCategoryRouter from "./modules/subCategory/subCategory.router.js";
import brandRouter from "./modules/brand/brand.router.js";
import productRouter from "./modules/product/product.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import orderRouter from "./modules/order/order.router.js";
import reviewRouter from "./modules/review/review.router.js";
import { globalErrorHandler } from "./utils/errorHandling.js";
import morgan from "morgan";
import cors from "cors";

const bootsratp = (app, express) => {
  // morgan
  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("common"));
  }

  app.use(cors());

  // global middleware
  app.use((req, res, next) => {
    if (req.originalUrl === "/order/webhook") {
      return next();
    }
    express.json()(req, res, next);
  });
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/subCategory", subCategoryRouter);
  app.use("/brand", brandRouter);
  app.use("/product", productRouter);
  app.use("/coupon", couponRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/review", reviewRouter);

  app.all("*", (req, res) => {
    return res.json({ message: "inVaild Path" });
  });
  connectDB();
  app.use(globalErrorHandler);
};

export default bootsratp;
