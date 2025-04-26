import { IRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import Image from "../schemas/Image";
import fs from "fs";

export const uploadImage = async (req: IRequest, res: Response) => {
  const userId = req.userId;
  try {
    const { file } = req;
    console.log(file);
    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const newImage = new Image({
      name: Date.now() + file.originalname,
      img: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    });
    await newImage.save();
    res.status(201).json({ message: "Image uploaded." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getImage = async (req: IRequest, res: Response) => {
  const { imageName } = req.params;
  if (!imageName) {
    return res.status(400).json({ message: "No image requested." });
  }
  try {
    const image = await Image.findOne({ name: imageName });
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }
    res.set("Content-Type", image.img.contentType.toString());
    res.status(200).send(Buffer.from(image.img.data.buffer));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error." });
  }
};
