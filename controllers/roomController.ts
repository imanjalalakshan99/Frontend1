import { Response } from "express";
import Place from "../schemas/Place";
import { IRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";
import { imageDelete, imageSave } from "../repositories/imageRepository";

export const addRoom = async (req: IRequest, res: Response) => {
  const image = req.file as Express.Multer.File;
  const { placeId } = req.params;
  if (!placeId) {
    return res.status(400).json({ message: "Missing data" });
  }
  let data;
  try {
    data = JSON.parse(req.body.room);
  } catch (error) {
    return res.status(400).json({ message: "Invalid room data" });
  }
  const { name, description, price, roomsCount, guestsCount } = data;
  if (!placeId || !name || !price || !roomsCount || !guestsCount) {
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
    place.rooms.push({
      _id: new mongoose.Types.ObjectId().toString(),
      name,
      description,
      price,
      image: imageName,
      roomsCount,
      guestsCount,
    });
    await place.save();
    res.status(200).json({ message: "Room added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while adding room", error });
  }
};

export const updateRoom = async (req: IRequest, res: Response) => {
  const image = req.file as Express.Multer.File;
  const { placeId, roomId } = req.params;
  if (!placeId || !roomId) {
    return res.status(400).json({ message: "Missing data" });
  }
  let data;
  try {
    data = JSON.parse(req.body.room);
  } catch (error) {
    return res.status(400).json({ message: "Invalid room data" });
  }
  const { name, description, price, roomsCount, guestsCount } = data;
  if (!placeId || !name || !price || !roomsCount || !guestsCount) {
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
    const room = place.rooms.find((room) => room._id.toString() === roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (image && room?.image) await imageDelete(room.image);
    room.image = image ? await imageSave(image) : room.image;
    room.name = name;
    room.description = description;
    room.price = price;
    room.roomsCount = roomsCount;
    room.guestsCount = guestsCount;
    await place.save();
    res.status(200).json({ message: "Room added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while adding room", error });
  }
};

export const deleteRoom = async (req: IRequest, res: Response) => {
  const { placeId, roomId } = req.params;
  if (!placeId || !roomId) {
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
    const room = place.rooms.find((room) => room._id.toString() === roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room?.image) await imageDelete(room.image);
    place.rooms = place.rooms.filter((room) => room._id.toString() !== roomId);
    place.reservations = place.reservations.filter(
      (reservation) => reservation.roomReservation?.room.toString() !== roomId
    );
    await place.save();
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while deleting room", error });
  }
};
