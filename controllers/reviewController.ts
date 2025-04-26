import { Response } from "express";
import Place from "../schemas/Place";
import User from "../schemas/User";
import { IReview } from "../models/IReview";
import { IRequest } from "../middlewares/authMiddleware";
import { IUser } from "../models/IUser";

export const putReview = async (req: IRequest, res: Response) => {
  const userId = req.userId;
  const { rating, comment, placeId } = req.body;
  if (!placeId || !userId || !rating) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findById(placeId).populate("reviews.user");
    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const newReview: IReview = {
      _id: undefined!,
      user: userId,
      rating: rating,
      comment: comment,
    };
    const review = await Place.findOne({ "reviews.user": userId });
    if (review) {
      place.reviews = place.reviews.filter((item) => {
        const user = item.user as IUser;
        return user._id.toString() !== userId.toString();
      });
      place.reviews.push(newReview);
    } else {
      place.reviews.push(newReview);
    }
    await place.save();
    res.status(201).json({ message: "Review created." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteReview = async (req: IRequest, res: Response) => {
  const userId = req.userId;
  const { placeId } = req.body;
  if (!placeId || !userId) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findById(placeId).populate("reviews.user");
    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }
    place.reviews = place.reviews.filter((item) => {
      const user = item.user as IUser;
      return user._id.toString() !== userId.toString();
    });
    await place.save();
    res.status(200).json({ message: "Review deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
