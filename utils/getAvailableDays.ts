import { DateTime } from "luxon";
import { IReservation } from "../models/IReservation";

interface ISlot {
  start: DateTime;
  end: DateTime;
}

export const getSlots = (start: DateTime, length: number): ISlot[] => {
  const freeSlots: ISlot[] = [];
  let currentStart = start;
  let currentEnd = start.plus({ days: 1 });
  [...Array(length).keys()].forEach((i) => {
    freeSlots.push({ start: currentStart, end: currentEnd });
    currentStart = currentStart.plus({ days: 1 });
    currentEnd = currentEnd.plus({ days: 1 });
  });
  return freeSlots;
};

export const getAvailableDays = (
  reservations: IReservation[],
  roomCount: number
): ISlot[] => {
  const now = DateTime.now().set({
    hour: 12,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const freeSlots = getSlots(now, 30);
  const availableDays: ISlot[] = [];
  freeSlots.forEach((slot) => {
    const reservationsInSlot = reservations.filter((reservation) => {
      const rr = reservation.roomReservation;
      if (!rr) return false;
      const reservationStart = DateTime.fromISO(rr.date.toISOString());
      const reservationEnd = reservationStart.plus({ days: rr.length });
      return (
        (slot.start >= reservationStart && slot.start < reservationEnd) ||
        (slot.end > reservationStart && slot.end <= reservationEnd)
      );
    });
    if (reservationsInSlot.length < roomCount) {
      availableDays.push(slot);
    }
  });
  return availableDays;
};
