import express, { Router } from "express";
import health from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import categoryRouter from "./categories";
import productRouter from "./products";
import productRegisterRouter from "./product-registers";
import productImageRegisterRouter from "./product-image-registers";
import productRatingRouter from "./product-ratings";
import userAddressRouter from "./user-addresses";
import couponCodeRouter from "./coupon-codes";

const v1: Router = express.Router();

v1.use("/health", health);
v1.use("/auth", authRouter);
v1.use("/profile", profileRouter);
v1.use("/categories", categoryRouter);
v1.use("/products", productRouter);
v1.use("/product-register", productRegisterRouter);
v1.use("/product-image-register", productImageRegisterRouter);
v1.use("/product-ratings", productRatingRouter);
v1.use("/user-addresses", userAddressRouter);
v1.use("/coupon-codes", couponCodeRouter);


export default v1;
