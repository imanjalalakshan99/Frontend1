import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/fileMiddleware";
import { createPlace } from "../controllers/placeController";
import { updateProfile } from "../controllers/userController";

const userRouter = express.Router();

userRouter.use(function (err: any, req: any, res: any, next: any) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});

userRouter.post(
  "/business",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createPlace
);

userRouter.post(
  "/profile",
  authMiddleware,
  upload.single("image"),
  updateProfile
);

export default userRouter;
