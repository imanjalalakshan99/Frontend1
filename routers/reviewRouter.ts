import express from "express";
import { deleteReview, putReview } from "../controllers/reviewController";
import { authMiddleware } from "../middlewares/authMiddleware";

const reviewRouter = express.Router();

reviewRouter.put("/", authMiddleware, putReview);
reviewRouter.delete("/", authMiddleware, deleteReview);

export default reviewRouter;
