import { Response } from "express";
import User from "../schemas/User";
import bcrypt from "bcryptjs";
import { IRequest } from "../middlewares/authMiddleware";
import Image from "../schemas/Image";

export const updateProfile = async (req: IRequest, res: Response) => {
  const image = req.file as Express.Multer.File;
  const { name, password } = JSON.parse(req.body.profile);
  if (!image && !name && !password) {
    return res.status(400).json({ message: "Missing data" });
  }
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let imageName = undefined;
    if (image) {
      imageName = Date.now() + image.originalname;
      const newImage = new Image({
        name: imageName,
        img: {
          data: image.buffer,
          contentType: image.mimetype,
        },
      });
      await newImage.save();
      user.profileImage = imageName;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (name) {
      user.firstName = name;
    }
    await user.save();
    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while updating profile", error });
  }
};
