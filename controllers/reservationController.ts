import { Request, Response } from "express";
import Place from "../schemas/Place";
import { IFreeSlotsDTO } from "../dtos/FreeSlotsDTO";
import { getFreeSlots } from "../utils/getFreeSlots";
import { IReservation } from "../models/IReservation";
import { IRequest } from "../middlewares/authMiddleware";
import { IUser } from "../models/IUser";
import { ReservationDTO } from "../dtos/ReservationDTO";
import { getUserDTO } from "../utils/dtoUtils";
import { getAvailableDays, getSlots } from "../utils/getAvailableDays";
import { DateTime } from "luxon";

export const getAvailableDaysForRoom = async (req: Request, res: Response) => {
  const { placeId, roomId, reservationId } = req.query;
  if (!roomId || !placeId) {
    return res.status(400).json({ message: "Invalid request." });
  }
  try {
    const place = await Place.findById(placeId).populate("createdBy");
    if (!place) {
      return res.status(404).json({ message: "Place not found!" });
    }
    const room = place.rooms.find((room) => room._id.toString() === roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }
    const { reservations } = place;
    const freeSlots = getAvailableDays(reservations, room.roomsCount);
    if (reservationId) {
      const reservation = reservations.find(
        (reservation) => reservation._id.toString() === reservationId
      );
      if (!reservation || !reservation.roomReservation) {
        return res.status(404).json({ message: "Reservation not found!" });
      }
      const currentStartDateObject = DateTime.fromJSDate(
        reservation.roomReservation.date
      );
      const currentDuration = reservation.roomReservation.length;
      const currentTakenSlots = getSlots(
        currentStartDateObject,
        currentDuration
      );
      currentTakenSlots.forEach((slot) => {
        const existingSlot = freeSlots.find((s) => s.start.equals(slot.start));
        if (!existingSlot) {
          freeSlots.push(slot);
        }
      });
    }
    const freeSlotsDTO = freeSlots.map((slot) => ({
      start: slot.start.toJSDate().toISOString(),
      end: slot.end.toJSDate().toISOString(),
    }));
    res.status(200).json(freeSlotsDTO);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};

export const createRoomReservation = async (req: IRequest, res: Response) => {
  const { placeId, roomId, startDate, endDate } = req.body;
  const userId = req.userId!;
  if (!roomId || !startDate || !endDate || !placeId) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findById(placeId).populate("createdBy");
    if (!place) {
      return res.status(404).json({ message: "Place not found!" });
    }
    const room = place.rooms.find((room) => room._id.toString() === roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }
    const { reservations } = place;
    const freeSlots = getAvailableDays(reservations, room.roomsCount);
    let tempDate = DateTime.fromISO(startDate).set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const endDateObject = DateTime.fromISO(endDate).set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (
      !freeSlots.find((slot) => slot.start.equals(tempDate)) ||
      !freeSlots.find((slot) => slot.end.equals(endDateObject))
    ) {
      return res.status(400).json({ message: "Please choose different date." });
    }
    const duration = endDateObject.diff(tempDate, "days").days;

    while (tempDate.toMillis() < endDateObject.toMillis()) {
      if (!freeSlots.find((slot) => slot.start.equals(tempDate))) {
        return res
          .status(400)
          .json({ message: "Please choose different date." });
      }
      tempDate = tempDate.plus({ days: 1 });
    }

    const reservation: IReservation = {
      _id: undefined!,
      user: userId,
      type: "room",
      roomReservation: {
        room: roomId,
        date: DateTime.fromISO(startDate).toJSDate(),
        length: duration,
      },
    };
    place.reservations.push(reservation);
    await place.save();
    res.status(200).json({ message: "Reservation created successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};

export const updateRoomReservation = async (req: IRequest, res: Response) => {
  const { reservationId } = req.params;
  const { placeId, roomId, startDate, endDate } = req.body;
  const userId = req.userId!;
  if (!roomId || !startDate || !endDate || !placeId) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findById(placeId).populate("createdBy");
    if (!place) {
      return res.status(404).json({ message: "Place not found!" });
    }
    const room = place.rooms.find((room) => room._id.toString() === roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }
    const { reservations } = place;
    const reservation = reservations.find(
      (reservation) => reservation._id.toString() === reservationId
    );
    if (
      !reservation ||
      reservation.type !== "room" ||
      !reservation.roomReservation
    ) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    const freeSlots = getAvailableDays(reservations, room.roomsCount);
    const currentStartDateObject = DateTime.fromJSDate(
      reservation.roomReservation.date
    );
    const currentDuration = reservation.roomReservation.length;
    const currentTakenSlots = getSlots(currentStartDateObject, currentDuration);
    freeSlots.push(...currentTakenSlots);
    const startDateObject = DateTime.fromISO(startDate).set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const endDateObject = DateTime.fromISO(endDate).set({
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (startDateObject.toMillis() >= endDateObject.toMillis()) {
      return res.status(400).json({ message: "Invalid date." });
    }
    if (
      !freeSlots.find((slot) => slot.start.equals(startDateObject)) ||
      !freeSlots.find((slot) => slot.end.equals(endDateObject))
    ) {
      return res.status(400).json({ message: "Please choose different date." });
    }
    let tempDate = startDateObject;
    while (tempDate.toMillis() < endDateObject.toMillis()) {
      if (!freeSlots.find((slot) => slot.start.equals(tempDate))) {
        return res
          .status(400)
          .json({ message: "Please choose different date." });
      }
      tempDate = tempDate.plus({ days: 1 });
    }
    const duration = endDateObject.diff(startDateObject, "days").days;
    reservation.roomReservation.date = startDateObject.toJSDate();
    reservation.roomReservation.length = duration;
    await place.save();
    res.status(200).json({ message: "Reservation updated successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while updating reservation", error });
  }
};

export const getFreeSlotsForService = async (req: Request, res: Response) => {
  const { placeId, serviceId } = req.query;
  if (!serviceId || !placeId) {
    return res.status(400).json({ message: "Invalid request." });
  }
  try {
    const place = await Place.findById(placeId).populate(
      "reviews.user createdBy"
    );
    if (!place) {
      return res.status(404).json({ message: "Place not found!" });
    }
    const service = place.services.find(
      (service) => service._id.toString() === serviceId
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    const { reservations, openingHours } = place;
    const freeSlots: IFreeSlotsDTO[] = getFreeSlots(
      openingHours,
      reservations,
      service.duration ?? 15
    );
    res.status(200).json(freeSlots);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};

const getEndTime = (startDate: Date, duration: number) => {
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration);
  return endDate;
};

export const createServiceReservation = async (
  req: IRequest,
  res: Response
) => {
  const { placeId, serviceId, date } = req.body;
  const userId = req.userId!;
  if (!serviceId || !date || !placeId) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findById(placeId).populate(
      "reviews.user createdBy"
    );
    if (!place) {
      return res.status(404).json({ message: "Place not found!" });
    }
    const service = place.services.find(
      (service) => service._id.toString() === serviceId
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    const { reservations } = place;
    const freeSlots: IFreeSlotsDTO[] = getFreeSlots(
      place.openingHours,
      reservations,
      service.duration ?? 15
    );
    const dateMs = new Date(date).getTime();
    const slot = freeSlots.find((slot) => new Date(slot).getTime() === dateMs);
    if (!slot) {
      return res.status(400).json({ message: "Please choose another time." });
    }
    const reservation: IReservation = {
      _id: undefined!,
      user: userId,
      type: "service",
      serviceReservation: {
        service: serviceId,
        reservationTime: {
          from: new Date(date),
          to: getEndTime(new Date(date), service.duration ?? 15),
        },
      },
    };
    place.reservations.push(reservation);
    await place.save();
    res.status(200).json({ message: "Reservation created successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};

export const updateServiceReservation = async (
  req: IRequest,
  res: Response
) => {
  const { reservationId } = req.params;
  const { placeId, serviceId, date } = req.body;
  if (!reservationId || !placeId || !serviceId || !date) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findOne({
      "reservations._id": reservationId,
    }).populate("reservations.user createdBy");
    if (!place) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    const reservation = place.reservations.find(
      (reservation) => reservation._id.toString() === reservationId
    );
    if (
      !reservation ||
      reservation.type !== "service" ||
      !reservation.serviceReservation
    ) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    if (
      (reservation.user as IUser)._id.toString() !== req.userId &&
      (place.createdBy as IUser)._id.toString() !== req.userId
    ) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    const service = place.services.find(
      (service) => service._id.toString() === serviceId
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found!" });
    }
    const { reservations, openingHours } = place;
    const freeSlots: IFreeSlotsDTO[] = getFreeSlots(
      openingHours,
      reservations,
      service.duration ?? 15
    );
    const dateMs = new Date(date).getTime();
    const slot = freeSlots.find((slot) => new Date(slot).getTime() === dateMs);
    if (!slot) {
      return res.status(400).json({ message: "Please choose another time." });
    }
    reservation.serviceReservation.reservationTime = {
      from: new Date(date),
      to: getEndTime(new Date(date), service.duration ?? 15),
    };
    await place.save();
    res.status(200).json({ message: "Reservation updated successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};

export const getReservations = async (req: IRequest, res: Response) => {
  const userId = req.userId;
  try {
    const places = await Place.find({
      "reservations.user": userId,
      $or: [{ "reservations.user": userId }, { createdBy: userId }],
    }).populate("reservations.user createdBy");
    const reservations = places.reduce((acc, place) => {
      place.reservations.forEach((reservation) => {
        const user = reservation.user as IUser;
        if (
          user._id.toString() !== userId &&
          (place.createdBy as IUser)._id.toString() !== userId
        )
          return;
        const service = place.services.find(
          (service) =>
            service._id.toString() ===
            reservation.serviceReservation?.service?.toString()
        );
        const room = place.rooms.find(
          (room) =>
            room._id.toString() ===
            reservation.roomReservation?.room?.toString()
        );
        if (!room && !service) return;
        const date = reservation.serviceReservation
          ? reservation.serviceReservation.reservationTime.from
          : reservation.roomReservation?.date;
        if (!date) return;
        const reservationDTO: ReservationDTO = {
          id: reservation._id,
          type: reservation.type,
          date: date.toISOString(),
          place: {
            id: place._id,
            name: place.name,
            owner: (place.createdBy as IUser)._id.toString(),
            address: place.address,
            image: place.thumbnail,
            location: place.location,
          },
          user:
            (place.createdBy as IUser)._id.toString() === userId
              ? getUserDTO(user)
              : undefined,
        };
        if (service)
          reservationDTO.service = {
            id: service._id,
            name: service.name,
            description: service.description,
            image: service.image,
            price: service.price,
            duration: service.duration,
          };
        if (room && reservation.roomReservation)
          reservationDTO.room = {
            id: room._id,
            name: room.name,
            description: room.description,
            image: room.image,
            guestsCount: room.guestsCount,
            price: room.price,
            length: reservation.roomReservation.length,
          };
        acc.push(reservationDTO);
      });
      return acc;
    }, [] as ReservationDTO[]);
    res.status(200).json(reservations);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};

export const cancelReservation = async (req: IRequest, res: Response) => {
  const { reservationId } = req.params;
  if (!reservationId) {
    return res.status(400).json({ message: "Invalid data." });
  }
  try {
    const place = await Place.findOne({
      "reservations._id": reservationId,
    }).populate("reservations.user createdBy");
    if (!place) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    const reservation = place.reservations.find(
      (reservation) => reservation._id.toString() === reservationId
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found!" });
    }
    if (
      (reservation.user as IUser)._id.toString() !== req.userId &&
      (place.createdBy as IUser)._id.toString() !== req.userId
    ) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    place.reservations = place.reservations.filter(
      (reservation) => reservation._id.toString() !== reservationId
    );
    await place.save();
    res.status(200).json({ message: "Reservation canceled successfully." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while fetching place", error });
  }
};
