import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  cancelReservation,
  getFreeSlotsForService,
  getReservations,
  createServiceReservation,
  updateServiceReservation,
  getAvailableDaysForRoom,
  createRoomReservation,
  updateRoomReservation,
} from "../controllers/reservationController";

const reservationRouter = express.Router();

reservationRouter.get("/available/services", getFreeSlotsForService);
reservationRouter.get("/available/rooms", getAvailableDaysForRoom);
reservationRouter.get("/", authMiddleware, getReservations);
reservationRouter.delete("/:reservationId", authMiddleware, cancelReservation);

reservationRouter.post("/service", authMiddleware, createServiceReservation);
reservationRouter.put(
  "/service/:reservationId",
  authMiddleware,
  updateServiceReservation
);

reservationRouter.post("/room", authMiddleware, createRoomReservation);
reservationRouter.put(
  "/room/:reservationId",
  authMiddleware,
  updateRoomReservation
);

export default reservationRouter;
