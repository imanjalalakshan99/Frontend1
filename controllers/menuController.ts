import { Response } from "express";
import Place from "../schemas/Place";
import { IRequest } from "../middlewares/authMiddleware";
import { imageDelete, imageSave } from "../repositories/imageRepository";
import mongoose from "mongoose";

export const addMenuItemToPlace = async (req: IRequest, res: Response) => {
  const image = req.file as Express.Multer.File;
  const { placeId } = req.params;
  let data;
  try {
    data = JSON.parse(req.body.menu);
  } catch (error) {
    return res.status(400).json({ message: "Invalid menu data" });
  }
  const { name, description, price } = data;
  if (!placeId || !name || !price) {
    return res.status(400).json({ message: "Missing data" });
  }
  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    if (place.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    let imageName = image ? await imageSave(image) : undefined;
    place.menu.push({
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      description,
      price,
      image: imageName,
    });
    await place.save();
    res.status(200).json({ message: "Menu item added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while adding menu item", error });
  }
};

export const updateMenuItem = async (req: IRequest, res: Response) => {
  const image = req.file as Express.Multer.File;
  const { placeId, menuId } = req.params;
  let data;
  try {
    data = JSON.parse(req.body.menu);
  } catch (error) {
    return res.status(400).json({ message: "Invalid menu data" });
  }
  const { name, description, price } = data;
  if (!placeId || !name || !price) {
    return res.status(400).json({ message: "Missing data" });
  }
  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    if (place.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const menuItem = place.menu.find((menu) => menu._id.toString() === menuId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    if (image && menuItem.image) {
      await imageDelete(menuItem.image);
    }
    menuItem.name = name;
    menuItem.description = description;
    menuItem.price = price;
    menuItem.image = image ? await imageSave(image) : menuItem.image;
    await place.save();
    res.status(200).json({ message: "Menu item updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while updating menu item", error });
  }
};

export const deleteMenuItemFromPlace = async (req: IRequest, res: Response) => {
  const { placeId, menuId } = req.params;
  if (!placeId || !menuId) {
    return res.status(400).json({ message: "Missing data" });
  }
  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    if (place.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const menuItem = place.menu.find((menu) => menu._id.toString() === menuId);
    if (menuItem?.image) await imageDelete(menuItem.image);
    place.menu = place.menu.filter((menu) => menu._id.toString() !== menuId);
    await place.save();
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while deleting menu item", error });
  }
};
