import express from "express";
import {
  deletePlace,
  getPlace,
  searchPlaces,
  updatePlace,
} from "../controllers/placeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/fileMiddleware";
import {
  addServiceToPlace,
  deleteServiceFromPlace,
  updateService,
} from "../controllers/serviceController";
import {
  addMenuItemToPlace,
  deleteMenuItemFromPlace,
  updateMenuItem,
} from "../controllers/menuController";
import { addRoom, deleteRoom, updateRoom } from "../controllers/roomController";

const placeRouter = express.Router();

placeRouter.get("/search", searchPlaces);
placeRouter.get("/:placeId", getPlace);
placeRouter.put(
  "/:placeId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updatePlace
);
placeRouter.delete("/:placeId", authMiddleware, deletePlace);
placeRouter.post(
  "/:placeId/service",
  authMiddleware,
  upload.single("image"),
  addServiceToPlace
);
placeRouter.put(
  "/:placeId/service/:serviceId",
  authMiddleware,
  upload.single("image"),
  updateService
);
placeRouter.delete(
  "/:placeId/service/:serviceId",
  authMiddleware,
  deleteServiceFromPlace
);
placeRouter.post(
  "/:placeId/menu",
  authMiddleware,
  upload.single("image"),
  addMenuItemToPlace
);
placeRouter.put(
  "/:placeId/menu/:menuId",
  authMiddleware,
  upload.single("image"),
  updateMenuItem
);
placeRouter.delete(
  "/:placeId/menu/:menuId",
  authMiddleware,
  deleteMenuItemFromPlace
);
placeRouter.post(
  "/:placeId/room",
  authMiddleware,
  upload.single("image"),
  addRoom
);
placeRouter.put(
  "/:placeId/room/:roomId",
  authMiddleware,
  upload.single("image"),
  updateRoom
);
placeRouter.delete("/:placeId/room/:roomId", authMiddleware, deleteRoom);

export default placeRouter;
